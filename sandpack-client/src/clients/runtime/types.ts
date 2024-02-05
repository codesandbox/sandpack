import type {
  BaseSandpackMessage,
  BundlerState,
  ClientStatus,
  Modules,
  NpmRegistry,
  ReactDevToolsMode,
  SandboxTestMessage,
  SandpackErrorMessage,
  SandpackLogLevel,
  SandpackMessageConsoleMethods,
  SandpackTemplate,
} from "../..";

export type SandpackRuntimeMessage = BaseSandpackMessage &
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
  );
