export enum SandpackLogLevel {
  None = 0,
  Error = 10,
  Warning = 20,
  Info = 30,
  Debug = 40,
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

export interface SandpackBundlerErrorMessage {
  title: string;
  path: string;
  message: string;
  line: number;
  column: number;
  payload: {
    frames?: ErrorStackFrame[];
  };
}

export type FileContent = Uint8Array | string;

export type FilesMap = Record<string, FileContent>;

export type SandpackBundlerMessages =
  | {
      type: "start";
      firstLoad?: boolean;
    }
  | {
      type: "done";
      compilatonError: boolean;
    }
  | {
      type: "compile";
      modules: FilesMap;
      template?: string;
      logLevel?: SandpackLogLevel;
    }
  | ({
      type: "action";
      action: "show-error";
    } & SandpackBundlerErrorMessage)
  | {
      type: "action";
      action: "notification";
      notificationType: "error";
      title: string;
    }
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
