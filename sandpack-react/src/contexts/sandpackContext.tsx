import { ClasserProvider } from "@code-hike/classer";
import type {
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackMessage,
  UnsubscribeFunction,
  ReactDevToolsMode,
} from "@codesandbox/sandpack-client";
import {
  SandpackClient,
  extractErrorDetails,
} from "@codesandbox/sandpack-client";
import isEqual from "lodash.isequal";
import * as React from "react";

import type { SandpackFiles } from "..";
import { SandpackThemeProvider } from "../contexts/themeContext";
import type {
  SandpackContext,
  SandpackInternalProvider,
  SandpackProviderState,
  SandpackProviderProps,
} from "../types";
import {
  convertedFilesToBundlerFiles,
  getSandpackStateFromProps,
} from "../utils/sandpackUtils";
import { generateRandomId } from "../utils/stringUtils";

/**
 * @category Provider
 */
const Sandpack = React.createContext<SandpackContext | null>(null);
const BUNDLER_TIMEOUT = 30000; // 30 seconds timeout for the bundler to respond.

/**
 * Main context provider that should wraps your entire component.
 * Use * [`useSandpack`](/api/react/#usesandpack) hook, which gives you the entire context object to play with.
 *
 * @category Provider
 * @hidden
 */
class SandpackProviderClass extends React.PureComponent<
  SandpackProviderProps,
  SandpackProviderState
> {
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

    const { activeFile, visibleFiles, files, environment } =
      getSandpackStateFromProps(props);

    this.state = {
      files,
      environment,
      visibleFiles,
      activeFile,
      startRoute: this.props.options?.startRoute,
      bundlerState: undefined,
      error: null,
      sandpackStatus: this.props.options?.autorun ?? true ? "initial" : "idle",
      editorState: "pristine",
      renderHiddenIframe: false,
      initMode: this.props.options?.initMode || "lazy",
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

  registerReactDevTools = (value: ReactDevToolsMode): void => {
    this.setState({ reactDevTools: value });
  };

  updateCurrentFile = (code: string): void => {
    this.updateFile(this.state.activeFile, code);
  };

  updateFile = (pathOrFiles: string | SandpackFiles, code?: string): void => {
    let files = this.state.files;

    if (typeof pathOrFiles === "string" && code) {
      if (code === this.state.files[pathOrFiles]?.code) {
        return;
      }

      files = { ...files, [pathOrFiles]: { code: code } };
    } else if (typeof pathOrFiles === "object") {
      files = { ...files, ...convertedFilesToBundlerFiles(pathOrFiles) };
    }

    this.setState({ files }, this.updateClients);
  };

  updateClients = (): void => {
    const { files, sandpackStatus } = this.state;
    const recompileMode = this.props.options?.recompileMode ?? "delayed";
    const recompileDelay = this.props.options?.recompileDelay ?? 500;

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

  initializeSandpackIframe(): void {
    const autorun = this.props.options?.autorun ?? true;

    if (!autorun) {
      return;
    }

    const observerOptions = this.props.options?.initModeObserverOptions ?? {
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

  componentDidMount(): void {
    this.initializeSandpackIframe();
  }

  componentDidUpdate(prevProps: SandpackProviderProps): void {
    /**
     * Watch the changes on the initMode prop
     */
    if (
      prevProps.options?.initMode !== this.props.options?.initMode &&
      this.props.options?.initMode
    ) {
      this.setState(
        { initMode: this.props.options?.initMode },
        this.initializeSandpackIframe
      );
    }

    /**
     * Custom setup derived from props
     */
    const { activeFile, visibleFiles, files, environment } =
      getSandpackStateFromProps(this.props);

    /**
     * What the changes on the customSetup props
     */
    if (
      prevProps.template !== this.props.template ||
      !isEqual(prevProps.customSetup, this.props.customSetup) ||
      !isEqual(prevProps.files, this.props.files)
    ) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ activeFile, visibleFiles, files, environment });

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
    if (editorState !== this.state.editorState) {
      this.setState({ editorState });
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

    if (this.initializeSandpackIframeHook) {
      clearTimeout(this.initializeSandpackIframeHook);
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
        externalResources: this.props.options?.externalResources,
        bundlerURL: this.props.options?.bundlerURL,
        startRoute: this.props.options?.startRoute,
        fileResolver: this.props.options?.fileResolver,
        skipEval: this.props.options?.skipEval ?? false,
        logLevel: this.props.options?.logLevel,
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
      client.iframe.contentWindow?.location.replace("about:blank");
      delete this.clients[clientId];
    } else {
      delete this.preregisteredIframes[clientId];
    }

    if (this.timeoutHook) {
      clearTimeout(this.timeoutHook);
    }

    this.setState({ sandpackStatus: "idle" });
  };

  unregisterAllClients = (): void => {
    Object.keys(this.clients).map(this.unregisterBundler);

    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  };

  setActiveFile = (activeFile: string): void => {
    this.setState({ activeFile });
  };

  openFile = (path: string): void => {
    this.setState(({ visibleFiles }) => {
      const newPaths = visibleFiles.includes(path)
        ? visibleFiles
        : [...visibleFiles, path];

      return {
        activeFile: path,
        visibleFiles: newPaths,
      };
    });
  };

  closeFile = (path: string): void => {
    if (this.state.visibleFiles.length === 1) {
      return;
    }

    this.setState(({ visibleFiles, activeFile }) => {
      const indexOfRemovedPath = visibleFiles.indexOf(path);
      const newPaths = visibleFiles.filter((openPath) => openPath !== path);

      return {
        activeFile:
          path === activeFile
            ? indexOfRemovedPath === 0
              ? visibleFiles[1]
              : visibleFiles[indexOfRemovedPath - 1]
            : activeFile,
        visibleFiles: newPaths,
      };
    });
  };

  deleteFile = (path: string): void => {
    this.setState(({ visibleFiles, files }) => {
      const newPaths = visibleFiles.filter((openPath) => openPath !== path);
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
        visibleFiles: newPaths,
        files: newFiles,
      };
    });
    this.updateClients();
  };

  dispatchMessage = (message: SandpackMessage, clientId?: string): void => {
    if (this.state.sandpackStatus !== "running") {
      console.warn(
        `[sandpack-react]: dispatch cannot be called while in idle mode`
      );
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

  resetFile = (path: string): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState(
      (prevState) => ({
        files: { ...prevState.files, [path]: files[path] },
      }),
      this.updateClients
    );
  };

  resetAllFiles = (): void => {
    const { files } = getSandpackStateFromProps(this.props);

    this.setState({ files }, this.updateClients);
  };

  _getSandpackState = (): SandpackContext => {
    const {
      files,
      activeFile,
      visibleFiles,
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
      visibleFiles,
      activeFile,
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

  render(): React.ReactElement {
    const { children, theme } = this.props;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        <ClasserProvider classes={this.props.options?.classes}>
          <SandpackThemeProvider theme={theme}>
            {children}
          </SandpackThemeProvider>
        </ClasserProvider>
      </Sandpack.Provider>
    );
  }
}

/**
 * @hidden
 */
const SandpackProvider: SandpackInternalProvider =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SandpackProviderClass as any;

/**
 * @category Provider
 */
const SandpackConsumer = Sandpack.Consumer;

export { SandpackProvider, SandpackConsumer, Sandpack as SandpackReactContext };
