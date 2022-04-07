/* eslint-disable @typescript-eslint/no-explicit-any */

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

export type TemplateFiles<Name extends SandpackPredefinedTemplate> =
  keyof typeof SANDBOX_TEMPLATES[Name]["files"];

export interface SandpackPreset {
  <
    Files extends SandpackFiles | any,
    TemplateName extends SandpackPredefinedTemplate = "react"
  >(
    props: SandpackProps<Files, TemplateName> & {
      files?: Files;
      template?: TemplateName;
    }
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
    props: React.PropsWithChildren<
      SandpackProviderProps<Files, TemplateName> & {
        files?: Files;
        template?: TemplateName;
      }
    >
  ): React.ReactElement<
    SandpackProviderProps,
    React.Provider<SandpackProviderState>
  > | null;
}

interface SandpackRootProps<
  Files extends SandpackFiles | any,
  TemplateName extends SandpackPredefinedTemplate
> {
  /**
   * It accepts an object, where each key is the relative
   * path of that file in the sandbox folder structure. Files passed in
   * through the files prop override those in the template structure.
   *
   * Since each template uses the same type to define the files, you can
   * overwrite the contents of any of the template files.
   */
  files?: Files;

  /**
   * Set of presets to easily initialize sandboxes. Each template contains
   * its files, environment and dependencies, and you can overwrite it
   * using `customSetup` or `dependencies`.
   */
  template?: TemplateName;

  /**
   * Pass custom properties to configurate your own Sandpack environment.
   *
   * Since each template uses the same type to define the files, you can
   * overwrite the contents of any of the template files.
   */
  customSetup?: SandpackSetup;
}

export interface SandpackOptions<
  Files extends SandpackFiles | any = any,
  TemplateName extends SandpackPredefinedTemplate = SandpackPredefinedTemplate
> {
  /**
   * List the file path listed in the file tab,
   * which will allow the user to interact with.
   */
  openPaths?: Array<
    Files extends SandpackFiles
      ? TemplateFiles<TemplateName> | keyof Files
      : TemplateFiles<TemplateName>
  >;

  /**
   * Path to the file will be open in the code editor when the component mounts
   */
  activePath?: Files extends SandpackFiles
    ? TemplateFiles<TemplateName> | keyof Files
    : TemplateFiles<TemplateName>;

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

interface SandpackProps<
  Files extends SandpackFiles | any,
  TemplateName extends SandpackPredefinedTemplate
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

/**
 * TODO: missing documentation
 */
export interface SandpackState {
  bundlerState: BundlerState | undefined;

  /**
   * List the file path listed in the file tab,
   * which will allow the user to interact with.
   */
  openPaths: string[];

  /**
   * Path to the file will be open in the code editor
   * when the component mounts
   */
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
   * Any template will include the needed dependencies,
   * but you can specify any additional dependencies. The key
   * should be the name of the package, while the value is the version,
   * in exactly the same format as it would be inside package.json.
   *
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
   * If you change the path of the entry file, make sure you control
   * all the files that go into the bundle process, as prexisting
   * settings in the template might not work anymore.
   */
  entry?: string;

  /**
   * Each sandbox has its own bundler attached to them which are configured
   * to support a specific framework and emulate their official CLI tools.
   * They are not one-to-one implementations and thus do not support advanced
   * configuration like custom webpack configurations or ejecting. However,
   * they are designed to mirror the default behavior of the framework
   */
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
  | "angular-cli"
  | "create-react-app"
  | "create-react-app-typescript"
  | "svelte"
  | "parcel"
  | "vue-cli"
  | "static";

export type SandpackPredefinedTemplate =
  | "angular"
  | "react"
  | "react-ts"
  | "vanilla"
  | "vanilla-ts"
  | "vue"
  | "vue3"
  | "svelte";

export type SandpackPredefinedTheme = "light" | "dark" | "auto";

interface SandpackSyntaxStyle {
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

/**
 * @hidden
 */
export interface SandpackProviderState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  openPaths: Array<TemplateFiles<SandpackPredefinedTemplate> | string>;
  activePath: TemplateFiles<SandpackPredefinedTemplate> | string;
  startRoute?: string;
  initMode: SandpackInitMode;
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  renderHiddenIframe: boolean;
  reactDevTools?: ReactDevToolsMode;
}
