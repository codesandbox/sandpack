import type {
  BundlerState,
  ListenerFunction,
  ReactDevToolsMode,
  SandpackBundlerFiles,
  SandpackClient,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
  SandpackLogLevel,
} from "@codesandbox/sandpack-client";
import type React from "react";

import type { SANDBOX_TEMPLATES } from "./templates";

import type { CodeEditorProps } from ".";

export type TemplateFiles<
  Name extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
> = keyof typeof SANDBOX_TEMPLATES[Name]["files"];
type SandpackFilesDerivedTemplate<Template extends SandpackPredefinedTemplate> =
  Partial<Record<TemplateFiles<Template>, string | SandpackFile>>;

export interface SandpackPreset {
  <
    Files extends SandpackFiles = SandpackFiles,
    TemplateName extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
  >(
    /**
     * Infer files & template values
     */
    props: Files extends SandpackFiles
      ? SandpackProps<Files, TemplateName> & {
          files?: SandpackFilesDerivedTemplate<TemplateName>;
          template?: TemplateName;
        }
      : never
  ): JSX.Element;
}

export interface SandpackProviderComponent {
  <
    Files extends SandpackFiles,
    TemplateName extends SandpackPredefinedTemplate
  >(
    /**
     * Infer files & template values
     */
    props: Files extends SandpackFiles
      ? React.PropsWithChildren<
          SandpackProviderProps<Files, TemplateName> & {
            files?: SandpackFilesDerivedTemplate<TemplateName>;
            template?: TemplateName;
          }
        >
      : never
  ): React.ReactElement<
    SandpackProviderProps,
    React.Provider<SandpackProviderState>
  > | null;
}

interface SandpackRootProps<
  Files,
  TemplateName extends SandpackPredefinedTemplate
> {
  // TODO
  files?: Files & SandpackFilesDerivedTemplate<TemplateName>;
  // TODO
  template?: SandpackPredefinedTemplate;
  // TODO
  customSetup?: SandpackSetup;
}

export interface SandpackOptions<
  Paths extends SandpackFiles = SandpackFiles,
  TemplateName extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
> {
  /**
   * List the file path listed in the file tab,
   * which will allow the user to interact with.
   */
  openPaths?: Array<TemplateFiles<TemplateName> | keyof Paths>;

  /**
   * Path to the file will be open in the code editor when the component mounts
   */
  activePath?: TemplateFiles<TemplateName> | keyof Paths;

  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  initModeObserverOptions?: IntersectionObserverInit;
  autorun?: boolean;
  recompileMode?: "immediate" | "delayed";
  recompileDelay?: number;

  /**
   * By default, Sandpack generates a random value to use as an id.
   * Use this to override this value if you need predictable values.
   */
  id?: string;
  logLevel?: SandpackLogLevel;
  bundlerURL?: string;
  startRoute?: string;
  skipEval?: boolean;
  fileResolver?: FileResolver;
  externalResources?: string[];
}

export interface SandpackProps<
  Files extends SandpackFiles = SandpackFiles,
  TemplateName extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
> extends SandpackRootProps<Files, TemplateName> {
  theme?: SandpackThemeProp;
  options?: SandpackOptions<Files, TemplateName> & {
    editorWidthPercentage?: number;
    editorHeight?: React.CSSProperties["height"];
    classes?: Record<string, string>;

    showNavigator?: boolean;
    showLineNumbers?: boolean;
    showInlineErrors?: boolean;
    showRefreshButton?: boolean;
    showTabs?: boolean;
    closableTabs?: boolean;
    wrapContent?: boolean;

    codeEditor?: SandpackCodeOptions;

    /**
     * This disables editing of content by the user in all files.
     */
    readOnly?: boolean;

    /**
     * Controls the visibility of Read-only label, which will only
     * appears when `readOnly` is `true`
     */
    showReadOnly?: boolean;
  };
}

export interface SandpackProviderProps<
  Files extends SandpackFiles = SandpackFiles,
  TemplateName extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
> extends SandpackRootProps<Files, TemplateName> {
  options?: SandpackOptions<Files, TemplateName>;
}

export interface SandpackProviderState {
  // Setup
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;

  // Options
  /**
   * List the file path listed in the file tab,
   * which will allow the user to interact with.
   */
  openPaths: Array<TemplateFiles | string>;
  /**
   * Path to the file will be open in the code editor when the component mounts
   */
  activePath: TemplateFiles | string;
  startRoute?: string;
  initMode: SandpackInitMode;

  // Internally
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  renderHiddenIframe: boolean;
  reactDevTools?: ReactDevToolsMode;
}

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

  /**
   * Returns the current state of the editor, meaning that any
   * changes from the original `files` must return a `dirty` value;
   * otherwise, it'll return `pristine`
   */
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
  registerReactDevTools: (value: ReactDevToolsMode) => void;

  /**
   * Element refs
   * Different components inside the SandpackProvider might register certain elements of interest for sandpack
   * eg: lazy anchor - if no component registers this, then the sandpack runs on mount, without lazy mode
   */
  lazyAnchorRef: React.RefObject<HTMLDivElement>;

  /**
   * eg: error screen - if no component registers this, the bundler needs to show the custom error screen
   * When the value is boolean, we only care if the components have the responsibility to render the elements,
   * we don't need the actual element reference
   */
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
  readOnly?: boolean;
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

export type SandpackPredefinedTheme = "light" | "dark";

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
  colors: {
    // Surface
    surface1: string;
    surface2: string;
    surface3: string;
    // UI
    disabled: string;
    base: string;
    clickable: string;
    hover: string;
    // Brand
    accent: string;
    // Feedbacks
    error?: string;
    errorSurface?: string;
    warning?: string;
    warningSurface?: string;
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
  font: {
    body: string;
    mono: string;
    size: string;
    lineHeight: string;
  };
}

export type SandpackPartialTheme = DeepPartial<SandpackTheme>;

export type SandpackThemeProp = SandpackPredefinedTheme | SandpackPartialTheme;

/**
 * Custom properties to be used in the SandpackCodeEditor component,
 * some of which are exclusive to customize the CodeMirror instance.
 */
export interface SandpackCodeOptions {
  /**
   * CodeMirror extensions for the editor state, which can
   * provide extra features and functionalities to the editor component.
   */
  extensions?: CodeEditorProps["extensions"];
  /**
   * Property to register CodeMirror extension keymap.
   */
  extensionsKeymap?: CodeEditorProps["extensionsKeymap"];
}

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
