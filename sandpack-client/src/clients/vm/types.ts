import type { FilesMap } from "@codesandbox/nodebox";

import type {
  BaseSandpackMessage,
  SandpackErrorMessage,
  SandpackLogLevel,
} from "../..";

type SandpackStandartMessages =
  | {
      type: "start";
      firstLoad?: boolean;
    }
  | {
      type: "done";
      compilatonError: boolean;
    };

type SandpackBundlerMessages =
  | {
      type: "compile";
      modules: FilesMap;
      template?: string;
      logLevel?: SandpackLogLevel;
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
    };

type SandpackFSMessages =
  | { type: "fs/change"; path: string; content: string }
  | { type: "fs/remove"; path: string };

type SandpackURLsMessages =
  | {
      type: "urlchange";
      url: string;
      back: boolean;
      forward: boolean;
    }
  | {
      type: "refresh";
    }
  | {
      type: "urlback";
    }
  | {
      type: "urlforward";
    };

export type SandpackVMMessage = BaseSandpackMessage &
  (
    | SandpackStandartMessages
    | SandpackURLsMessages
    | SandpackBundlerMessages
    | { type: "connected" }
    | {
        type: "stdout";
        payload: SandpackShellStdoutData;
      }
    | { type: "vm/progress"; data: string }
    | { type: "vm/request_editor_url" }
    | { type: "vm/response_editor_url"; data: string }
    | SandpackFSMessages
  );

export interface SandpackShellStdoutData {
  data?: string;
  type?: "out" | "err";
}
