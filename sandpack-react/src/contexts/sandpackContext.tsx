import type {
  BundlerState,
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
} from "@codesandbox/sandpack-client";
import {
  SandpackClient,
  extractErrorDetails,
} from "@codesandbox/sandpack-client";
import * as React from "react";

import type {
  SandpackContext,
  SandboxEnvironment,
  FileResolver,
  SandpackStatus,
  EditorState,
  SandpackPredefinedTemplate,
  SandpackSetup,
} from "../types";
import { getSandpackStateFromProps } from "../utils/sandpackUtils";
import { generateRandomId } from "../utils/stringUtils";

const Sandpack = React.createContext<SandpackContext | null>(null);
const BUNDLER_TIMEOUT = 30000; // 30 seconds timeout for the bundler to respond.

export interface SandpackProviderState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  activePath: string;
  openPaths: string[];
  startRoute?: string;
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  renderHiddenIframe: boolean;
}

export interface SandpackProviderProps {
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  // editor state (override values)
  activePath?: string;
  openPaths?: string[];

  // execution and recompile
  recompileMode?: "immediate" | "delayed";
  recompileDelay?: number;
  autorun?: boolean;

  // bundler options
  bundlerURL?: string;
  startRoute?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
}

class SandpackProvider extends React.PureComponent<
  SandpackProviderProps,
  SandpackProviderState
> {
  static defaultProps = {
    skipEval: false,
    recompileMode: "delayed",
    recompileDelay: 500,
    autorun: true,
  };

  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  preregisteredIframes: Record<string, HTMLIFrameElement>;
  clients: Record<string, SandpackClient>;

  errorScreenRegistered: React.MutableRefObject<boolean>;
  openInCSBRegistered: React.MutableRefObject<boolean>;
  loadingScreenRegistered: React.MutableRefObject<boolean>;

  intersectionObserver?: IntersectionObserver;
  queuedListeners: Record<string, Record<string, ListenerFunction>>;
  unsubscribeQueuedListeners: Record<
    string,
    Record<string, UnsubscribeFunction>
  >;
  unsubscribe?: UnsubscribeFunction;
  debounceHook?: number;
  timeoutHook: NodeJS.Timer | null = null;

  constructor(props: SandpackProviderProps) {
    super(props);

    const {
      activePath,
      openPaths,
      files,
      environment,
    } = getSandpackStateFromProps(props);

    this.state = {
      files,
      environment,
      openPaths,
      activePath,
      startRoute: this.props.startRoute,
      bundlerState: undefined,
      error: null,
      sandpackStatus: this.props.autorun ? "initial" : "idle",
      editorState: "pristine",
      renderHiddenIframe: false,
    };

    /**
     * List of functions to be registered in the client, once it has been created
     *
     * Use cases:
     * - Set a listener, but the client hasn't been created yet;
     * - Set a listener, but the client has already been created;
     * - A client already exists, set a new listener and then one more client has been created;
     */
    this.queuedListeners = { global: {} };
    /**
     * Global list of unsubscribe function for the listeners
     */
    this.unsubscribeQueuedListeners = {};
    this.preregisteredIframes = {};
    this.clients = {};

    this.lazyAnchorRef = React.createRef<HTMLDivElement>();
    this.errorScreenRegistered = React.createRef<boolean>() as React.MutableRefObject<boolean>;
    this.openInCSBRegistered = React.createRef<boolean>() as React.MutableRefObject<boolean>;
    this.loadingScreenRegistered = React.createRef<boolean>() as React.MutableRefObject<boolean>;
  }

  handleMessage = (msg: SandpackMessage): void => {
    if (this.timeoutHook) {
      clearTimeout(this.timeoutHook);
    }

    if (msg.type === "state") {
      this.setState({ bundlerState: msg.state });
    } else if (msg.type === "done" && !msg.compilatonError) {
      this.setState({ error: null });
    } else if (msg.type === "action" && msg.action === "show-error") {
      this.setState({ error: extractErrorDetails(msg) });
    } else if (
      msg.type === "action" &&
      msg.action === "notification" &&
      msg.notificationType === "error"
    ) {
      this.setState({
        error: { message: msg.title },
      });
    }
  };

  updateCurrentFile = (newCode: string): void => {
    this.updateFile(this.state.activePath, newCode);
  };

  updateFile = (path: string, newCode: string): void => {
    if (newCode === this.state.files[this.state.activePath]?.code) {
      return;
    }

    const { files } = this.state;
    const newFiles = {
      ...files,
      [path]: { code: newCode },
    };

    this.setState({ files: newFiles }, this.updateClients);
  };

  updateClients = (): void => {
    const { files, sandpackStatus } = this.state;
    const { recompileMode, recompileDelay } = this.props;
    if (sandpackStatus !== "running") {
      return;
    }

    if (recompileMode === "immediate") {
      Object.values(this.clients).forEach((client) => {
        client.updatePreview({
          files,
        });
      });
    }

    if (recompileMode === "delayed") {
      window.clearTimeout(this.debounceHook);
      this.debounceHook = window.setTimeout(() => {
        Object.values(this.clients).forEach((client) => {
          client.updatePreview({
            files: this.state.files,
          });
        });
      }, recompileDelay);
    }
  };

  componentDidMount(): void {
    if (!this.props.autorun) {
      return;
    }

    if (this.lazyAnchorRef.current) {
      // If any component registerd a lazy anchor ref component, use that for the intersection observer
      const options = {
        rootMargin: "600px 0px",
        threshold: 0.1,
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0]?.intersectionRatio > 0) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          setTimeout(() => {
            this.runSandpack();
          }, 50);

          this.intersectionObserver?.unobserve(this.lazyAnchorRef.current!);
        }
      }, options);

      this.intersectionObserver.observe(this.lazyAnchorRef.current);
    } else {
      // else run the sandpack on mount, with a slight delay to allow all subcomponents to mount/register components
      setTimeout(() => this.runSandpack(), 50);
    }
  }

  componentDidUpdate(prevProps: SandpackProviderProps): void {
    if (
      prevProps.template !== this.props.template ||
      prevProps.activePath !== this.props.activePath ||
      JSON.stringify(prevProps.openPaths) !==
        JSON.stringify(this.props.openPaths) ||
      JSON.stringify(prevProps.customSetup) !==
        JSON.stringify(this.props.customSetup)
    ) {
      const {
        activePath,
        openPaths,
        files,
        environment,
      } = getSandpackStateFromProps(this.props);

      /* eslint-disable react/no-did-update-set-state */
      this.setState({ activePath, openPaths, files, environment });

      if (this.state.sandpackStatus !== "running") {
        return;
      }

      Object.values(this.clients).forEach((client) =>
        client.updatePreview({
          files,
          template: environment,
        })
      );
    }
  }

  componentWillUnmount(): void {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
    }

    if (this.timeoutHook) {
      clearTimeout(this.timeoutHook);
    }

    if (this.debounceHook) {
      clearTimeout(this.debounceHook);
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  createClient = (
    iframe: HTMLIFrameElement,
    clientId: string
  ): SandpackClient => {
    const client = new SandpackClient(
      iframe,
      {
        files: this.state.files,
        template: this.state.environment,
      },
      {
        bundlerURL: this.props.bundlerURL,
        startRoute: this.props.startRoute,
        fileResolver: this.props.fileResolver,
        skipEval: this.props.skipEval,
        showOpenInCodeSandbox: !this.openInCSBRegistered.current,
        showErrorScreen: !this.errorScreenRegistered.current,
        showLoadingScreen: !this.loadingScreenRegistered.current,
      }
    );

    // Subscribe inside the context with the first client that gets instantiated.
    // This subscription is for global states like error and timeout, so no need for a per client listen
    // Also, set the timeout timer only when the first client is instantiated
    if (typeof this.unsubscribe !== "function") {
      this.unsubscribe = client.listen(this.handleMessage);

      this.timeoutHook = setTimeout(() => {
        this.setState({ sandpackStatus: "timeout" });
      }, BUNDLER_TIMEOUT);
    }

    /**
     * Register any potential listeners that subscribed before sandpack ran
     */
    if (this.queuedListeners[clientId]) {
      Object.keys(this.queuedListeners[clientId]).forEach((listenerId) => {
        const listener = this.queuedListeners[clientId][listenerId];
        const unsubscribe = client.listen(listener) as () => void;
        this.unsubscribeQueuedListeners[clientId][listenerId] = unsubscribe;
      });

      // Clear the queued listeners after they were registered
      this.queuedListeners[clientId] = {};
    }

    /**
     * Register global listeners
     */
    const globalListeners = Object.entries(this.queuedListeners.global);
    globalListeners.forEach(([listenerId, listener]) => {
      const unsubscribe = client.listen(listener) as () => void;
      this.unsubscribeQueuedListeners[clientId][listenerId] = unsubscribe;

      /**
       * Important: Do not clean the global queue
       * Instead of cleaning the queue, keep it there for the
       * following clients that might be created
       */
    });

    return client;
  };

  runSandpack = (): void => {
    Object.keys(this.preregisteredIframes).forEach((clientId) => {
      const iframe = this.preregisteredIframes[clientId];
      this.clients[clientId] = this.createClient(iframe, clientId);
    });

    this.setState({ sandpackStatus: "running" });
  };

  registerBundler = (iframe: HTMLIFrameElement, clientId: string): void => {
    if (this.state.sandpackStatus === "running") {
      this.clients[clientId] = this.createClient(iframe, clientId);
    } else {
      this.preregisteredIframes[clientId] = iframe;
    }
  };

  unregisterBundler = (clientId: string): void => {
    const client = this.clients[clientId];
    if (client) {
      client.cleanup();
      delete this.clients[clientId];
    } else {
      delete this.preregisteredIframes[clientId];
    }
  };

  setActiveFile = (path: string): void => {
    this.setState({ activePath: path, editorState: "dirty" });
  };

  openFile = (path: string): void => {
    this.setState(({ openPaths }) => {
      const newPaths = openPaths.includes(path)
        ? openPaths
        : [...openPaths, path];

      return {
        activePath: path,
        openPaths: newPaths,
        editorState: "dirty",
      };
    });
  };

  closeFile = (path: string): void => {
    if (this.state.openPaths.length === 1) {
      return;
    }

    this.setState(({ openPaths, activePath }) => {
      const indexOfRemovedPath = openPaths.indexOf(path);
      const newPaths = openPaths.filter((openPath) => openPath !== path);

      return {
        activePath:
          path === activePath
            ? indexOfRemovedPath === 0
              ? openPaths[1]
              : openPaths[indexOfRemovedPath - 1]
            : activePath,
        openPaths: newPaths,
        editorState: "dirty",
      };
    });
  };

  deleteFile = (path: string): void => {
    this.setState(({ openPaths, files }) => {
      const newPaths = openPaths.filter((openPath) => openPath !== path);
      const newFiles = Object.keys(files).reduce(
        (acc: SandpackBundlerFiles, filePath) => {
          if (filePath === path) {
            return acc;
          }
          acc[filePath] = files[filePath];
          return acc;
        },
        {}
      );

      return {
        openPaths: newPaths,
        files: newFiles,
        editorState: "dirty",
      };
    });
    this.updateClients();
  };

  dispatchMessage = (message: SandpackMessage, clientId?: string): void => {
    if (this.state.sandpackStatus !== "running") {
      console.warn("dispatch cannot be called while in idle mode");
      return;
    }

    if (clientId) {
      this.clients[clientId].dispatch(message);
    } else {
      Object.values(this.clients).forEach((client) => {
        client.dispatch(message);
      });
    }
  };

  addListener = (
    listener: ListenerFunction,
    clientId?: string
  ): UnsubscribeFunction => {
    if (clientId) {
      if (this.clients[clientId]) {
        const unsubscribeListener = this.clients[clientId].listen(listener);

        return unsubscribeListener;
      } else {
        // When listeners are added before the client is instantiated, they are stored with an unique id
        // When the client is eventually instantiated, the listeners are registered on the spot
        // Their unsubscribe functions are stored in unsubscribeQueuedListeners for future cleanup
        const listenerId = generateRandomId();
        this.queuedListeners[clientId] = this.queuedListeners[clientId] || {};
        this.unsubscribeQueuedListeners[clientId] =
          this.unsubscribeQueuedListeners[clientId] || {};

        this.queuedListeners[clientId][listenerId] = listener;

        const unsubscribeListener = () => {
          if (this.queuedListeners[clientId][listenerId]) {
            // unsubscribe was called before the client was instantiated
            // common example - a component with autorun=false that unmounted
            delete this.queuedListeners[clientId][listenerId];
          } else if (this.unsubscribeQueuedListeners[clientId][listenerId]) {
            // unsubscribe was called for a listener that got added before the client was instantiated
            // call the unsubscribe function and remove it from memory
            this.unsubscribeQueuedListeners[clientId][listenerId]();
            delete this.unsubscribeQueuedListeners[clientId][listenerId];
          }
        };

        return unsubscribeListener;
      }
    } else {
      // Push to the **global** queue
      const listenerId = generateRandomId();
      this.queuedListeners.global[listenerId] = listener;

      // Add to the current clients
      const clients = Object.values(this.clients);
      const currentClientUnsubscribeListeners = clients.map((client) =>
        client.listen(listener)
      );

      const unsubscribeListener = () => {
        const unsubscribeQueuedClients = Object.values(
          this.unsubscribeQueuedListeners
        );

        // Unsubscribing all listener registered
        unsubscribeQueuedClients.forEach((listenerOfClient) => {
          const listenerFunctions = Object.values(listenerOfClient);
          listenerFunctions.forEach((unsubscribe) => unsubscribe());
        });

        // Unsubscribing from the clients already created
        currentClientUnsubscribeListeners.forEach((unsubscribe) =>
          unsubscribe()
        );
      };

      return unsubscribeListener;
    }
  };

  resetFile = (path: string): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState((prevState) => ({
      files: { ...prevState.files, [path]: files[path] },
    }));
  };

  resetAllFiles = (): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState({ files });
  };

  _getSandpackState = (): SandpackContext => {
    const {
      files,
      activePath,
      openPaths,
      startRoute,
      bundlerState,
      editorState,
      error,
      sandpackStatus,
      environment,
    } = this.state;

    return {
      files,
      environment,
      openPaths,
      activePath,
      startRoute,
      error,
      bundlerState,
      status: sandpackStatus,
      editorState,
      closeFile: this.closeFile,
      deleteFile: this.deleteFile,
      dispatch: this.dispatchMessage,
      errorScreenRegisteredRef: this.errorScreenRegistered,
      lazyAnchorRef: this.lazyAnchorRef,
      listen: this.addListener,
      loadingScreenRegisteredRef: this.loadingScreenRegistered,
      openFile: this.openFile,
      openInCSBRegisteredRef: this.openInCSBRegistered,
      registerBundler: this.registerBundler,
      resetAllFiles: this.resetAllFiles,
      resetFile: this.resetFile,
      runSandpack: this.runSandpack,
      setActiveFile: this.setActiveFile,
      unregisterBundler: this.unregisterBundler,
      updateCurrentFile: this.updateCurrentFile,
      updateFile: this.updateFile,
    };
  };

  render(): React.ReactElement {
    const { children } = this.props;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        {children}
      </Sandpack.Provider>
    );
  }
}

const SandpackConsumer = Sandpack.Consumer;

export { SandpackProvider, SandpackConsumer, Sandpack as SandpackReactContext };
