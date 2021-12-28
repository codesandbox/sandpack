import type {
  BundlerState,
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackClient,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
} from "@codesandbox/sandpack-client";

export type SandpackClientDispatch = (
  msg: SandpackMessage,
  clientId?: string
) => void;

export type SandpackClientListen = (
  listener: ListenerFunction,
  clientId?: string
) => UnsubscribeFunction;

export type SandpackContext = SandpackState & {
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
};

export interface SandpackState {
  bundlerState: BundlerState | undefined;
  openPaths: string[];
  activePath: string;
  startRoute?: string;
  editorState: EditorState;
  error: SandpackError | null;
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  status: SandpackStatus;
  initMode: SandpackInitMode;
  clients: Record<string, SandpackClient>;

  runSandpack: () => void;
  registerBundler: (iframe: HTMLIFrameElement, clientId: string) => void;
  unregisterBundler: (clientId: string) => void;
  updateFile: (path: string, newCode: string) => void;
  updateCurrentFile: (newCode: string) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  deleteFile: (path: string) => void;
  setActiveFile: (path: string) => void;
  resetFile: (path: string) => void;
  resetAllFiles: () => void;
  registerReactDevTools: () => void;

  // Element refs
  // Different components inside the SandpackProvider might register certain elements of interest for sandpack
  // eg: lazy anchor - if no component registers this, then the sandpack runs on mount, without lazy mode
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  // eg: error screen - if no component registers this, the bundler needs to show the custom error screen
  // When the value is boolean, we only care if the components have the responsibility to render the elements,
  // we don't need the actual element reference
  errorScreenRegisteredRef: React.MutableRefObject<boolean>;
  openInCSBRegisteredRef: React.MutableRefObject<boolean>;
  loadingScreenRegisteredRef: React.MutableRefObject<boolean>;
}

export type SandpackStatus =
  | "initial"
  | "idle"
  | "running"
  | "timeout"
  | "done";
export type EditorState = "pristine" | "dirty";

export interface SandboxTemplate {
  files: Record<string, SandpackFile>;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  entry: string;
  main: string;
  environment: SandboxEnvironment;
}

export interface SandpackFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
}

export type SandpackFiles = Record<string, string | SandpackFile>;

export interface SandpackSetup {
  /**
   * Examples:
   * ```js
   * {
   *  "react": "latest",
   *  "@material-ui/core": "4.12.3",
   * }
   * ```
   */
  dependencies?: Record<string, string>;
  /**
   * The entry file is the starting point of the bundle process.
   *
   * If you change the path of the entry file, make sure you control all the files that go into the bundle process, as prexisting settings in the template might not work anymore.
   */
  entry?: string;
  main?: string;
  files?: SandpackFiles;
  environment?: SandboxEnvironment;
}

/**
 * `immediate`: It immediately mounts all components, such as the code-editor
 * and the preview - this option might overload the memory usage
 * and resource from the browser on a page with multiple instances;
 *
 * `lazy`: Only initialize the components when the user is about to scroll
 * them to the viewport and keep these components mounted until the user
 * leaves the page - this is the default value;
 *
 * `user-visible`: Only initialize the components when the user is about
 * to scroll them to the viewport, but differently from lazy, this option
 * unmounts those components once it's no longer in the viewport.
 */
export type SandpackInitMode = "immediate" | "lazy" | "user-visible";

export type SandboxEnvironment =
  | "adonis"
  | "vue-cli"
  | "preact-cli"
  | "svelte"
  | "create-react-app-typescript"
  | "create-react-app"
  | "angular-cli"
  | "parcel"
  | "@dojo/cli-create-app"
  | "cxjs"
  | "gatsby"
  | "nuxt"
  | "next"
  | "reason"
  | "apollo"
  | "sapper"
  | "ember"
  | "nest"
  | "static"
  | "styleguidist"
  | "gridsome"
  | "vuepress"
  | "mdx-deck"
  | "quasar"
  | "docusaurus"
  | "node";

export type SandpackPredefinedTemplate =
  | "angular"
  | "react"
  | "react-ts"
  | "vanilla"
  | "vanilla-ts"
  | "vue"
  | "vue3"
  | "svelte";

export type SandpackPredefinedTheme =
  | "light"
  | "dark"
  | "sandpack-dark"
  | "night-owl"
  | "aqua-blue"
  | "github-light"
  | "monokai-pro";

export interface SandpackSyntaxStyle {
  color?: string;
  fontStyle?: "normal" | "italic";
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
}

export interface SandpackTheme {
  palette: {
    activeText: string;
    defaultText: string;
    inactiveText: string;
    activeBackground: string;
    defaultBackground: string;
    inputBackground: string;
    accent: string;
    errorBackground: string;
    errorForeground: string;
  };
  syntax: {
    plain: string | SandpackSyntaxStyle;
    comment: string | SandpackSyntaxStyle;
    keyword: string | SandpackSyntaxStyle;
    definition: string | SandpackSyntaxStyle;
    punctuation: string | SandpackSyntaxStyle;
    property: string | SandpackSyntaxStyle;
    tag: string | SandpackSyntaxStyle;
    static: string | SandpackSyntaxStyle;
    string?: string | SandpackSyntaxStyle; // use static as fallback
  };
  typography: {
    bodyFont: string;
    monoFont: string;
    fontSize: string;
    lineHeight: string;
  };
}

export type SandpackPartialTheme = DeepPartial<SandpackTheme>;

export type SandpackThemeProp =
  | SandpackPredefinedTheme
  | SandpackPartialTheme
  | "auto";

/**
 * @hidden
 */
export type DeepPartial<Type> = {
  [Property in keyof Type]?: DeepPartial<Type[Property]>;
};

export interface FileResolver {
  isFile: (path: string) => Promise<boolean>;
  readFile: (path: string) => Promise<string>;
}
