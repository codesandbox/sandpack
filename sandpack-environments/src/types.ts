import type { SandpackBundlerEnvironmentOptions } from "./clients/bundler";
import type { SandpackStaticEnvironmentOptions } from "./clients/static";
import type { SandpackVMEnvironmentOptions } from "./clients/vm";
import type { FileContent } from "./sandpack-bundler-types";

export type SandpackEnvironmentOptions =
  | ({
      type: "static";
    } & SandpackStaticEnvironmentOptions)
  | ({
      type: "bundler";
    } & SandpackBundlerEnvironmentOptions)
  | ({
      type: "vm";
    } & SandpackVMEnvironmentOptions);

export interface DirectoryEntry {
  name: string;
  type: "file" | "directory";
}

export interface SandpackFileSystem {
  writeFile(path: string, content: FileContent): Promise<void>;
  readFile(path: string): Promise<FileContent>;
  writeFileMetadata(path: string, metadata: object): void;
  readFileMetadata(path: string): object;
  readDirectory(path: string): Promise<DirectoryEntry[]>;
  createDirectory(path: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
  watchDirectory(path: string, callback: () => void): () => void;
  watch(callback: () => void): () => void;
  dispose(): void;
}

export interface SandpackPreviewMessage {
  type: "urlchange";
  url: string;
  back: boolean;
  forward: boolean;
}

export type SandpackPreviewStatus =
  | {
      current: "LOADING";
      progress: string[];
    }
  | {
      current: "READY";
    }
  | {
      current: "ERROR";
      error: Error;
    };

// TODO: Implement method to initialize iframe
export interface SandpackPreview {
  status: SandpackPreviewStatus;
  iframe: HTMLIFrameElement;
  onStatusChange(listener: (status: SandpackPreviewStatus) => void): () => void;
  onMessage(listener: (message: SandpackPreviewMessage) => void): () => void;
  back(): void;
  forward(): void;
  refresh(): void;
  dispose(): void;
}

export type SandpackEnvironmentStatus =
  | {
      current: "LOADING";
      progress: string[];
    }
  | {
      current: "READY";
    }
  | {
      current: "ERROR";
      error: Error;
    };

export interface SandpackEnvironment {
  type: "bundler" | "static" | "vm";
  status: SandpackEnvironmentStatus;
  onStatusChange(
    listener: (status: SandpackEnvironmentStatus) => void
  ): () => void;
  createPreview(): SandpackPreview;
  fs: SandpackFileSystem;
  restart: () => void;
  dispose(): void;
}
