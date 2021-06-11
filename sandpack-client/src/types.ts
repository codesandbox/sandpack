import type { ITemplate } from "codesandbox-import-util-types";

export interface SandpackBundlerFile {
  code: string;
}

export type SandpackBundlerFiles = Record<string, SandpackBundlerFile>;

export interface Module {
  code: string;
  path: string;
}

export type Modules = Record<
  string,
  {
    code: string;
    path: string;
  }
>;

export type Dependencies = Record<string, string>;

export interface ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: unknown | undefined;
}

export interface ErrorStackFrame {
  columnNumber: number;
  fileName: string;
  functionName: string;
  lineNumber: number;
  _originalColumnNumber: number;
  _originalFileName: string;
  _originalFunctionName: string;
  _originalLineNumber: number;
  _originalScriptCode: Array<{
    lineNumber: number;
    content: string;
    highlight: boolean;
  }>;
}

export interface TranspiledModule {
  module: Module;
  query: string;
  source: ModuleSource | undefined;
  assets: Record<string, ModuleSource>;
  isEntry: boolean;
  isTestFile: boolean;
  childModules: string[];
  /**
   * All extra modules emitted by the loader
   */
  emittedAssets: ModuleSource[];
  initiators: string[];
  dependencies: string[];
  asyncDependencies: string[];
  transpilationDependencies: string[];
  transpilationInitiators: string[];
}

export interface BundlerState {
  entry: string;
  transpiledModules: Record<string, TranspiledModule>;
}

export type ClientStatus =
  | "initializing"
  | "installing-dependencies"
  | "transpiling"
  | "evaluating"
  | "running-tests"
  | "idle";

export type ListenerFunction = (msg: SandpackMessage) => void;
export type UnsubscribeFunction = () => void;

export type Listen = (
  listener: ListenerFunction,
  clientId?: string
) => UnsubscribeFunction;
export type Dispatch = (msg: SandpackMessage, clientId?: string) => void;

export interface SandpackError {
  message: string;
  line?: number;
  column?: number;
  path?: string;
  title?: string;
}

export interface SandpackErrorMessage {
  title: string;
  path: string;
  message: string;
  line: number;
  column: number;
  payload: {
    frames?: ErrorStackFrame[];
  };
}

export interface BaseSandpackMessage {
  type: string;
  $id?: number;
  codesandbox?: boolean;
}

export type SandpackMessage = BaseSandpackMessage &
  (
    | {
        type: "initialized";
      }
    | {
        type: "start";
        firstLoad?: boolean;
      }
    | {
        type: "status";
        status: ClientStatus;
      }
    | {
        type: "state";
        state: BundlerState;
      }
    | {
        type: "success";
      }
    | ({
        type: "action";
        action: "show-error";
      } & SandpackErrorMessage)
    | {
        type: "action";
        action: "notification";
        notificationType: "error";
        title: string;
      }
    | {
        type: "done";
        compilatonError: boolean; // TODO: fix typo?
      }
    | {
        type: "urlchange";
        url: string;
        back: boolean;
        forward: boolean;
      }
    | {
        type: "resize";
        height: number;
      }
    | {
        type: "transpiler-context";
        data: Record<string, Record<string, unknown>>;
      }
    | {
        type: "compile";
        version: number;
        isInitializationCompile?: boolean;
        modules: Modules;
        externalResources: string[];
        hasFileResolver: boolean;
        disableDependencyPreprocessing?: boolean;
        template?: string | ITemplate;
        showOpenInCodeSandbox: boolean;
        showErrorScreen: boolean;
        showLoadingScreen: boolean;
        skipEval: boolean;
        clearConsoleDisabled?: boolean;
      }
    | {
        type: "refresh";
      }
    | {
        type: "urlback";
      }
    | {
        type: "urlforward";
      }
    | {
        type: "get-transpiler-context";
      }
  );
