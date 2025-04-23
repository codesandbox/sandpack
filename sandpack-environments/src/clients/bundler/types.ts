export interface SandpackError {
  message: string;
  line?: number;
  column?: number;
  path?: string;
  title?: string;
}

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

export interface ModuleSource {
  fileName: string;
  compiledCode: string;
  sourceMap: unknown | undefined;
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
  | "idle"
  | "done";

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

export interface NpmRegistry {
  enabledScopes: string[];
  limitToScopes: boolean;
  registryUrl: string;
  /**
   * It must be `false` if you're providing a sef-host solution,
   * otherwise, it'll try to proxy from CodeSandbox Proxy
   */
  proxyEnabled: boolean;
  registryAuthToken?: string;
}

export enum SandpackLogLevel {
  None = 0,
  Error = 10,
  Warning = 20,
  Info = 30,
  Debug = 40,
}

export type ReactDevToolsMode = "latest" | "legacy";

export type SandpackTemplate =
  | "angular-cli"
  | "create-react-app"
  | "create-react-app-typescript"
  | "svelte"
  | "parcel"
  | "vue-cli"
  | "static"
  | "solid"
  | "nextjs";

export type SandpackMessageConsoleMethods =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "table"
  | "clear"
  | "time"
  | "timeEnd"
  | "count"
  | "assert";

type TestStatus = "running" | "pass" | "fail";

export type TestError = Error & {
  matcherResult?: boolean;
  mappedErrors?: Array<{
    fileName: string;
    _originalFunctionName: string;
    _originalColumnNumber: number;
    _originalLineNumber: number;
    _originalScriptCode: Array<{
      lineNumber: number;
      content: string;
      highlight: boolean;
    }> | null;
  }>;
};

export interface Test {
  name: string;
  blocks: string[];
  status: TestStatus;
  path: string;
  errors: TestError[];
  duration?: number | undefined;
}

export type ListenerFunction = (msg: SandpackMessage) => void;
export type UnsubscribeFunction = () => void;

export interface FileResolver {
  isFile: (path: string) => Promise<boolean>;
  readFile: (path: string) => Promise<string>;
}

export interface BaseProtocolMessage {
  type: string;
  msgId: string;
}

export interface ProtocolErrorMessage extends BaseProtocolMessage {
  error: {
    message: string;
  };
}

export interface ProtocolResultMessage extends BaseProtocolMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

export interface ProtocolRequestMessage extends BaseProtocolMessage {
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
}

export type SandboxTestMessage =
  | RunAllTests
  | RunTests
  | ClearJestErrors
  | ({ type: "test" } & (
      | InitializedTestsMessage
      | TestCountMessage
      | TotalTestStartMessage
      | TotalTestEndMessage
      | AddFileMessage
      | RemoveFileMessage
      | FileErrorMessage
      | DescribeStartMessage
      | DescribeEndMessage
      | AddTestMessage
      | TestStartMessage
      | TestEndMessage
    ));

interface InitializedTestsMessage {
  event: "initialize_tests";
}

interface ClearJestErrors {
  type: "action";
  action: "clear-errors";
  source: "jest";
  path: string;
}

interface TestCountMessage {
  event: "test_count";
  count: number;
}

interface TotalTestStartMessage {
  event: "total_test_start";
}

interface TotalTestEndMessage {
  event: "total_test_end";
}

interface AddFileMessage {
  event: "add_file";
  path: string;
}

interface RemoveFileMessage {
  event: "remove_file";
  path: string;
}

interface FileErrorMessage {
  event: "file_error";
  path: string;
  error: TestError;
}

interface DescribeStartMessage {
  event: "describe_start";
  blockName: string;
}

interface DescribeEndMessage {
  event: "describe_end";
}

interface AddTestMessage {
  event: "add_test";
  testName: string;
  path: string;
}

interface TestStartMessage {
  event: "test_start";
  test: Test;
}

interface TestEndMessage {
  event: "test_end";
  test: Test;
}

interface RunAllTests {
  type: "run-all-tests";
}

interface RunTests {
  type: "run-tests";
  path: string;
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
        compilatonError: boolean;
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
        experimental_enableServiceWorker?: boolean;
        experimental_stableServiceWorkerId?: string;
        template?: string | SandpackTemplate;
        showOpenInCodeSandbox: boolean;
        showErrorScreen: boolean;
        showLoadingScreen: boolean;
        skipEval: boolean;
        clearConsoleDisabled?: boolean;
        reactDevTools?: ReactDevToolsMode;
        logLevel?: SandpackLogLevel;
        customNpmRegistries?: NpmRegistry[];
        teamId?: string;
        sandboxId?: string;
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
    | { type: "get-modules" }
    | { type: "all-modules"; data: Array<{ path: string; code: string }> }
    | {
        type: "activate-react-devtools";
      }
    | {
        type: "console";
        log: Array<{
          method: SandpackMessageConsoleMethods;
          id: string;
          data: string[];
        }>;
      }
    | SandboxTestMessage
    | { type: "sign-in"; teamId: string }
    | { type: "sign-out" }
    | {
        type: "dependencies";
        data:
          | {
              state: "downloading_manifest";
            }
          | {
              state: "downloaded_module";
              name: string;
              total: number;
              progress: number;
            }
          | {
              state: "starting";
            };
      }
  );

export interface SandpackBundlerFile {
  code: string;
  hidden?: boolean;
  active?: boolean;
  readOnly?: boolean;
}

export type SandpackBundlerFiles = Record<string, SandpackBundlerFile>;

export type Dependencies = Record<string, string>;

export const CHANNEL_NAME = "$CSB_RELAY";

export interface IPreviewRequestMessage {
  $channel: typeof CHANNEL_NAME;
  $type: "preview/request";
  id: string;
  method: string;
  url: string;
}

export interface IPreviewResponseMessage {
  $channel: typeof CHANNEL_NAME;
  $type: "preview/response";
  id: string;
  status: number;
  headers: Record<string, string>;
  body: string | Uint8Array;
}
