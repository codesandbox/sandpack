import { ClasserProvider } from "@code-hike/classer";
import type {
  ListenerFunction,
  SandpackMessage,
  UnsubscribeFunction,
  ReactDevToolsMode,
  SandpackClient,
} from "@codesandbox/sandpack-client";
import { extractErrorDetails } from "@codesandbox/sandpack-client";
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
export class SandpackProviderClass extends React.PureComponent<
  SandpackProviderProps,
  SandpackProviderState
> {
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  preregisteredIframes: Record<string, HTMLIFrameElement>;
  clients: Record<string, SandpackClient>;

  errorScreenRegistered: React.MutableRefObject<boolean>;
  openInCSBRegistered: React.MutableRefObject<boolean>;
  loadingScreenRegistered: React.MutableRefObject<boolean>;

  queuedListeners: Record<string, Record<string, ListenerFunction>>;
  unsubscribeClientListeners: Record<
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
      visibleFilesFromProps: visibleFiles,
      activeFile,
      startRoute: this.props.options?.startRoute,
      bundlerState: undefined,
      error: null,
      sandpackStatus: this.props.options?.autorun ?? true ? "initial" : "idle",
      editorState: "pristine",
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
    this.unsubscribeClientListeners = {};
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

    const unsubscribeQueuedClients = Object.values(
      this.unsubscribeClientListeners
    );

    // Unsubscribing all listener registered
    unsubscribeQueuedClients.forEach((listenerOfClient) => {
      const listenerFunctions = Object.values(listenerOfClient);
      listenerFunctions.forEach((unsubscribe) => unsubscribe());
    });

    this.setState({ sandpackStatus: "idle" });
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
        /**
         * When listeners are added before the client is instantiated, they are stored with an unique id
         * When the client is eventually instantiated, the listeners are registered on the spot
         * Their unsubscribe functions are stored in unsubscribeClientListeners for future cleanup
         */
        const listenerId = generateRandomId();
        this.queuedListeners[clientId] = this.queuedListeners[clientId] || {};
        this.unsubscribeClientListeners[clientId] =
          this.unsubscribeClientListeners[clientId] || {};

        this.queuedListeners[clientId][listenerId] = listener;

        const unsubscribeListener = (): void => {
          if (this.queuedListeners[clientId][listenerId]) {
            /**
             * Unsubscribe was called before the client was instantiated
             * common example - a component with autorun=false that unmounted
             */
            delete this.queuedListeners[clientId][listenerId];
          } else if (this.unsubscribeClientListeners[clientId][listenerId]) {
            /**
             * unsubscribe was called for a listener that got added before the client was instantiated
             * call the unsubscribe function and remove it from memory
             */
            this.unsubscribeClientListeners[clientId][listenerId]();
            delete this.unsubscribeClientListeners[clientId][listenerId];
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
        // Unsubscribing from the clients already created
        currentClientUnsubscribeListeners.forEach((unsubscribe) =>
          unsubscribe()
        );
      };

      return unsubscribeListener;
    }
  };

  _getSandpackState = (): SandpackContext => {
    const {
      files,
      activeFile,
      visibleFiles,
      visibleFilesFromProps,
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
      visibleFilesFromProps,
      activeFile,
      startRoute,
      error,
      bundlerState,
      status: sandpackStatus,
      editorState,
      initMode,
      clients: this.clients,

      dispatch: this.dispatchMessage,
      errorScreenRegisteredRef: this.errorScreenRegistered,
      lazyAnchorRef: this.lazyAnchorRef,
      listen: this.addListener,
      loadingScreenRegisteredRef: this.loadingScreenRegistered,
      openInCSBRegisteredRef: this.openInCSBRegistered,
      registerBundler: this.registerBundler,
      runSandpack: this.runSandpack,
      unregisterBundler: this.unregisterBundler,
      registerReactDevTools: this.registerReactDevTools,
    };
  };

  render(): React.ReactElement {
    const { children, theme, className, style } = this.props;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        <ClasserProvider classes={this.props.options?.classes}>
          <SandpackThemeProvider
            className={className}
            style={style}
            theme={theme}
          >
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