import type {
  BundlerState,
  ListenerFunction,
  ModuleError,
  SandpackBundlerFiles,
  SandpackMessage,
  UnsubscribeFunction,
} from "@codesandbox/sandpack-client";
import { SandpackClient } from "@codesandbox/sandpack-client";
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

export interface SandpackProviderState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  activePath: string;
  openPaths: string[];
  startRoute?: string;
  bundlerState?: BundlerState;
  error: Partial<ModuleError> | null;
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

  client: SandpackClient | null;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  errorScreenRegistered: React.MutableRefObject<boolean>;
  openInCSBRegistered: React.MutableRefObject<boolean>;
  loadingScreenRegistered: React.MutableRefObject<boolean>;

  intersectionObserver?: IntersectionObserver;
  queuedListeners: Record<string, ListenerFunction>;
  unsubscribeQueuedListeners: Record<string, UnsubscribeFunction>;
  unsubscribe?: UnsubscribeFunction;
  debounceHook?: number;

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

    this.client = null;
    this.queuedListeners = {};
    this.unsubscribeQueuedListeners = {};
    this.iframeRef = React.createRef<HTMLIFrameElement>();

    this.lazyAnchorRef = React.createRef<HTMLDivElement>();
    this.errorScreenRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
    this.openInCSBRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
    this.loadingScreenRegistered = React.createRef<
      boolean
    >() as React.MutableRefObject<boolean>;
  }

  handleMessage = (msg: SandpackMessage): void => {
    if (msg.type === "state") {
      this.setState({ bundlerState: msg.state });
    } else if (msg.type === "done" && !msg.compilatonError) {
      this.setState({ error: null });
    } else if (msg.type === "action" && msg.action === "show-error") {
      const { title, path, message, line, column } = msg;
      this.setState({
        error: { title, path, message, line, column },
      });
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

    const { files, sandpackStatus } = this.state;
    const { recompileMode, recompileDelay } = this.props;

    const newFiles = {
      ...files,
      [path]: { code: newCode },
    };

    this.setState({ files: newFiles });

    if (sandpackStatus !== "running") {
      return;
    }

    if (recompileMode === "immediate") {
      if (!this.client) {
        return;
      }

      this.client.updatePreview({
        files: newFiles,
      });
    }

    if (recompileMode === "delayed") {
      window.clearTimeout(this.debounceHook);
      this.debounceHook = window.setTimeout(() => {
        if (!this.client) {
          return;
        }

        this.client.updatePreview({
          files: this.state.files,
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
        threshold: 0,
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        if (
          entries[0]?.intersectionRatio > 0 &&
          this.state.sandpackStatus === "initial"
        ) {
          // Delay a cycle so all hooks register the refs for the sub-components (open in csb, loading, error overlay)
          setTimeout(() => this.runSandpack());
        }
      }, options);

      this.intersectionObserver.observe(this.lazyAnchorRef.current);
    } else {
      // else run the sandpack on the spot
      setTimeout(() => this.runSandpack());
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

      if (this.state.sandpackStatus !== "running" || !this.client) {
        return;
      }

      this.client.updatePreview({
        files,
        template: environment,
      });
    }
  }

  componentWillUnmount(): void {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.client) {
      this.client.cleanup();
    }
  }

  runSandpack = (): void => {
    const iframe = this.iframeRef.current;
    if (!iframe) {
      // If no component mounts an iframe, the context will render a hidden one, mount it and run sandpack on it
      this.setState({ renderHiddenIframe: true }, this.runSandpack);

      return;
    }

    this.client = new SandpackClient(
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

    this.unsubscribe = this.client.listen(this.handleMessage);

    // Register any potential listeners that subscribed before sandpack ran
    Object.keys(this.queuedListeners).forEach((listenerId) => {
      const listener = this.queuedListeners[listenerId];
      const unsubscribe = this.client!.listen(listener) as () => void;
      this.unsubscribeQueuedListeners[listenerId] = unsubscribe;
    });

    // Clear the queued listeners after they were registered
    this.queuedListeners = {};
    this.setState({ sandpackStatus: "running" });
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

  dispatchMessage = (message: SandpackMessage): void => {
    if (this.client === null) {
      console.warn("dispatch cannot be called while in idle mode");
      return;
    }

    this.client.dispatch(message);
  };

  addListener = (listener: ListenerFunction): UnsubscribeFunction => {
    if (this.client === null) {
      // When listeners are added before the client is instantiated, they are stored with an unique id
      // When the client is eventually instantiated, the listeners are registered on the spot
      // Their unsubscribe functions are stored in unsubscribeQueuedListeners for future cleanup
      const listenerId = generateRandomId();
      this.queuedListeners[listenerId] = listener;
      return () => {
        if (this.queuedListeners[listenerId]) {
          // unsubscribe was called before the client was instantiated
          // common example - a component with autorun=false that unmounted
          delete this.queuedListeners[listenerId];
        } else if (this.unsubscribeQueuedListeners[listenerId]) {
          // unsubscribe was called for a listener that got added before the client was instantiated
          // call the unsubscribe function and remove it from memory
          this.unsubscribeQueuedListeners[listenerId]();
          delete this.unsubscribeQueuedListeners[listenerId];
        }
      };
    }

    return this.client.listen(listener) as () => void;
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
    } = this.state;

    return {
      files,
      openPaths,
      activePath,
      startRoute,
      error,
      bundlerState,
      status: sandpackStatus,
      editorState,
      setActiveFile: this.setActiveFile,
      openFile: this.openFile,
      updateCurrentFile: this.updateCurrentFile,
      updateFile: this.updateFile,
      runSandpack: this.runSandpack,
      dispatch: this.dispatchMessage,
      listen: this.addListener,
      iframeRef: this.iframeRef,
      lazyAnchorRef: this.lazyAnchorRef,
      errorScreenRegisteredRef: this.errorScreenRegistered,
      openInCSBRegisteredRef: this.openInCSBRegistered,
      loadingScreenRegisteredRef: this.loadingScreenRegistered,
    };
  };

  render(): React.ReactElement {
    const { children } = this.props;
    const { renderHiddenIframe } = this.state;

    return (
      <Sandpack.Provider value={this._getSandpackState()}>
        {renderHiddenIframe && (
          <iframe
            ref={this.iframeRef}
            style={{ display: "none" }}
            title="Sandpack"
          />
        )}
        {children}
      </Sandpack.Provider>
    );
  }
}

const SandpackConsumer = Sandpack.Consumer;

export { SandpackProvider, SandpackConsumer, Sandpack as SandpackReactContext };
