import { InMemoryFileSystem } from "../../InMemoryFileSystem.js";
import type {
  SandpackEnvironment,
  SandpackEnvironmentStatus,
  SandpackPreview,
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";
import { debounce } from "../../utils";

import { SandpackBundlerPreview } from "./BundlerPreview.js";
import type {
  FileResolver,
  NpmRegistry,
  ReactDevToolsMode,
  SandpackLogLevel,
  SandpackTemplate,
} from "./types.js";

export interface SandpackBundlerEnvironmentOptions {
  teamId?: string;
  experimental_enableServiceWorker?: boolean;
  experimental_stableServiceWorkerId?: string;
  bundlerURL?: string;
  externalResources?: string[];
  fileResolver?: FileResolver;
  startRoute?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  autorun?: boolean;
  autoReload?: boolean;
  recompileMode?: "immediate" | "delayed";
  recompileDelay?: number;
  id?: string;
  bundlerTimeOut?: number;
  entry?: string;
  reactDevTools?: ReactDevToolsMode;
  disableDependencyPreprocessing?: boolean;
  template?: SandpackTemplate;
  showOpenInCodeSandbox?: boolean;
  showErrorScreen?: boolean;
  showLoadingScreen?: boolean;
  skipEval?: boolean;
  clearConsoleOnFirstCompile?: boolean;
  logLevel?: SandpackLogLevel;
  customNpmRegistries?: NpmRegistry[];
  sandboxId?: string;
}

export class SandpackBundlerEnvironment implements SandpackEnvironment {
  readonly type = "bundler";
  private previews = new Map<HTMLIFrameElement, SandpackBundlerPreview>();
  private statusSubscribers = new Set<
    (status: SandpackEnvironmentStatus) => void
  >();
  status: SandpackEnvironmentStatus = {
    current: "LOADING",
    progress: [],
  };
  fs = new InMemoryFileSystem();

  constructor(private options: SandpackBundlerEnvironmentOptions) {
    this.fs.watch(
      debounce(() => {
        this.previews.forEach((preview) => {
          preview.updateSandbox();
        });
      }, 10)
    );
  }

  restart() {
    // TODO
  }

  onStatusChange(
    callback: (status: SandpackEnvironmentStatus) => void
  ): () => void {
    this.statusSubscribers.add(callback);
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  createPreview(): SandpackPreview {
    const iframe = document.createElement("iframe");
    const staticPreview = new SandpackBundlerPreview(
      iframe,
      this.options,
      this.fs
    );

    this.previews.set(iframe, staticPreview);

    return {
      iframe,
      get status() {
        return staticPreview.status;
      },
      onStatusChange(subscriber: (status: SandpackPreviewStatus) => void) {
        return staticPreview.onStatusChange(subscriber);
      },
      onMessage(subscriber: (message: SandpackPreviewMessage) => void) {
        return () => {
          // Coming soon
        };
      },
      back() {
        // TODO
      },
      forward() {
        // TODO
      },
      refresh() {
        // TODO
      },
      dispose: () => {
        this.previews.delete(iframe);
        staticPreview.dispose();
      },
    };
  }

  public dispose() {
    this.fs.dispose();
    this.previews.forEach((preview) => {
      preview.dispose();
    });
    this.previews.clear();
  }
}
