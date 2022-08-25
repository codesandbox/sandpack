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