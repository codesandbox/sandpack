import type {
  BundlerState,
  ListenerFunction,
  SandpackBundlerFiles,
  SandpackError,
  SandpackMessage,
  UnsubscribeFunction,
} from "@codesandbox/sandpack-client";
import type { ITemplate } from "codesandbox-import-util-types";

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
  files: SandpackBundlerFiles;
  dependencies: Record<string, string>;
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
  dependencies?: Record<string, string>;
  entry?: string;
  main?: string;
  files?: SandpackFiles;
  environment?: SandboxEnvironment;
}

export type SandboxEnvironment = ITemplate;

export type SandpackPredefinedTemplate =
  | "angular"
  | "react"
  | "vanilla"
  | "vue"
  | "vue3";

export type SandpackPredefinedTheme =
  | "codesandbox-light"
  | "codesandbox-dark"
  | "night-owl"
  | "aqua-blue"
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
  };
}

export type SandpackPartialTheme = DeepPartial<SandpackTheme>;

export type SandpackThemeProp =
  | SandpackPredefinedTheme
  | SandpackPartialTheme
  | "auto";

export type DeepPartial<Type> = {
  [Property in keyof Type]?: DeepPartial<Type[Property]>;
};

export interface FileResolver {
  isFile: (path: string) => Promise<boolean>;
  readFile: (path: string) => Promise<string>;
}
