import type {
  BundlerState,
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
  ReactDevToolsMode,
  SandpackLogLevel,
} from "@codesandbox/sandpack-client";
import {
  SandpackClient,
  extractErrorDetails,
} from "@codesandbox/sandpack-client";
import isEqual from "lodash.isequal";
import * as React from "react";

import type {
  SandpackContext,
  SandboxEnvironment,
  FileResolver,
  SandpackStatus,
  EditorState,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackInitMode,
} from "../types";
import { getSandpackStateFromProps } from "../utils/sandpackUtils";
import { generateRandomId } from "../utils/stringUtils";

/**
 * @category Provider
 */
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
  initMode: SandpackInitMode;
  reactDevTools?: ReactDevToolsMode;
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

  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  initModeObserverOptions?: IntersectionObserverInit;

  // bundler options
  bundlerURL?: string;
  logLevel?: SandpackLogLevel;
  startRoute?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
  externalResources?: string[];
}

/**
 * Main context provider that should wraps your entire component.
 * Use * [`useSandpack`](/api/react/#usesandpack) hook, which gives you the entire context object to play with.
 *
 * @category Provider
 * @noInheritDoc
 */
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
  initializeSandpackIframeHook: NodeJS.Timer | null = null;

  constructor(props: SandpackProviderProps) {
    super(props);

    const { activePath, openPaths, files, environment } =
      getSandpackStateFromProps(props);

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
      initMode: this.props.initMode || "lazy",
      reactDevTools: undefined,
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
    this.errorScreenRegistered =
      React.createRef<boolean>() as React.MutableRefObject<boolean>;
    this.openInCSBRegistered =
      React.createRef<boolean>() as React.MutableRefObject<boolean>;
    this.loadingScreenRegistered =
      React.createRef<boolean>() as React.MutableRefObject<boolean>;
  }

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
  registerReactDevTools = (value: ReactDevToolsMode): void => {
    this.setState({ reactDevTools: value });
  };

  /**
   * @hidden
   */
  updateCurrentFile = (newCode: string): void => {
    this.updateFile(this.state.activePath, newCode);
  };

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
  initializeSandpackIframe(): void {
    if (!this.props.autorun) {
      return;
    }

    const observerOptions = this.props.initModeObserverOptions ?? {
      rootMargin: `1000px 0px`,
    };

    if (this.intersectionObserver && this.lazyAnchorRef.current) {
      this.intersectionObserver?.unobserve(this.lazyAnchorRef.current);
    }

    if (this.lazyAnchorRef.current && this.state.initMode === "lazy") {
      // If any component registerd a lazy anchor ref component, use that for the intersection observer
      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          this.initializeSandpackIframeHook = setTimeout(() => {
            this.runSandpack();
          }, 50);

          if (this.lazyAnchorRef.current) {
            this.intersectionObserver?.unobserve(this.lazyAnchorRef.current);
          }
        }
      }, observerOptions);

      this.intersectionObserver.observe(this.lazyAnchorRef.current);
    } else if (
      this.lazyAnchorRef.current &&
      this.state.initMode === "user-visible"
    ) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          this.initializeSandpackIframeHook = setTimeout(() => {
            this.runSandpack();
          }, 50);
        } else {
          if (this.initializeSandpackIframeHook) {
            clearTimeout(this.initializeSandpackIframeHook);
          }

          Object.keys(this.clients).map(this.unregisterBundler);
          this.unregisterAllClients();
        }
      }, observerOptions);

      this.intersectionObserver.observe(this.lazyAnchorRef.current);
    } else {
      // else run the sandpack on mount, with a slight delay to allow all subcomponents to mount/register components
      this.initializeSandpackIframeHook = setTimeout(
        () => this.runSandpack(),
        50
      );
    }
  }

  /**
   * @hidden
   */
  componentDidMount(): void {
    this.initializeSandpackIframe();
  }

  /**
   * @hidden
   */
  componentDidUpdate(prevProps: SandpackProviderProps): void {
    /**
     * Watch the changes on the initMode prop
     */
    if (prevProps.initMode !== this.props.initMode && this.props.initMode) {
      this.setState(
        { initMode: this.props.initMode },
        this.initializeSandpackIframe
      );
    }

    /**
     * Custom setup derived from props
     */
    const { activePath, openPaths, files, environment } =
      getSandpackStateFromProps(this.props);

    /**
     * What the changes on the customSetup props
     */
    if (
      prevProps.template !== this.props.template ||
      prevProps.activePath !== this.props.activePath ||
      !isEqual(prevProps.openPaths, this.props.openPaths) ||
      !isEqual(prevProps.customSetup, this.props.customSetup)
    ) {
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

    /**
     * Watch the changes on editorState
     */
    const editorState = isEqual(files, this.state.files) ? "pristine" : "dirty";
    this.setState({ editorState });
  }

  /**
   * @hidden
   */
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

    if (this.initializeSandpackIframeHook) {
      clearTimeout(this.initializeSandpackIframeHook);
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * @hidden
   */
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
        externalResources: this.props.externalResources,
        bundlerURL: this.props.bundlerURL,
        logLevel: this.props.logLevel,
        startRoute: this.props.startRoute,
        fileResolver: this.props.fileResolver,
        skipEval: this.props.skipEval,
        showOpenInCodeSandbox: !this.openInCSBRegistered.current,
        showErrorScreen: !this.errorScreenRegistered.current,
        showLoadingScreen: !this.loadingScreenRegistered.current,
        reactDevTools: this.state.reactDevTools,
      }
    );

    /**
     * Subscribe inside the context with the first client that gets instantiated.
     * This subscription is for global states like error and timeout, so no need for a per client listen
     * Also, set the timeout timer only when the first client is instantiated
     */
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

  /**
   * @hidden
   */
  runSandpack = (): void => {
    Object.keys(this.preregisteredIframes).forEach((clientId) => {
      const iframe = this.preregisteredIframes[clientId];
      this.clients[clientId] = this.createClient(iframe, clientId);
    });

    this.setState({ sandpackStatus: "running" });
  };

  /**
   * @hidden
   */
  registerBundler = (iframe: HTMLIFrameElement, clientId: string): void => {
    if (this.state.sandpackStatus === "running") {
      this.clients[clientId] = this.createClient(iframe, clientId);
    } else {
      this.preregisteredIframes[clientId] = iframe;
    }
  };

  /**
   * @hidden
   */
  unregisterBundler = (clientId: string): void => {
    const client = this.clients[clientId];
    if (client) {
      client.cleanup();
      client.iframe.removeAttribute("src");
      delete this.clients[clientId];
    } else {
      delete this.preregisteredIframes[clientId];
    }

    if (this.timeoutHook) {
      clearTimeout(this.timeoutHook);
    }

    this.setState({ sandpackStatus: "idle" });
  };

  /**
   * @hidden
   */
  unregisterAllClients = (): void => {
    Object.keys(this.clients).map(this.unregisterBundler);

    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  };

  /**
   * @hidden
   */
  setActiveFile = (activePath: string): void => {
    this.setState({ activePath });
  };

  /**
   * @hidden
   */
  openFile = (path: string): void => {
    this.setState(({ openPaths }) => {
      const newPaths = openPaths.includes(path)
        ? openPaths
        : [...openPaths, path];

      return {
        activePath: path,
        openPaths: newPaths,
      };
    });
  };

  /**
   * @hidden
   */
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
      };
    });
  };

  /**
   * @hidden
   */
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
      };
    });
    this.updateClients();
  };

  /**
   * @hidden
   */
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

  /**
   * @hidden
   */
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

        const unsubscribeListener = (): void => {
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

      const unsubscribeListener = (): void => {
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

  /**
   * @hidden
   */
  resetFile = (path: string): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState(
      (prevState) => ({
        files: { ...prevState.files, [path]: files[path] },
      }),
      this.updateClients
    );
  };

  /**
   * @hidden
   */
  resetAllFiles = (): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState({ files }, this.updateClients);
  };

  /**
   * @hidden
   */
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
      initMode,
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
      initMode,
      clients: this.clients,
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
      registerReactDevTools: this.registerReactDevTools,
    };
  };

  /**
   * @hidden
   */
  render(): React.ReactElement {
    const { children } = this.props;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        {children}
      </Sandpack.Provider>
    );
  }
}

/**
 * @category Provider
 */
const SandpackConsumer = Sandpack.Consumer;

export { SandpackProvider, SandpackConsumer, Sandpack as SandpackReactContext };
