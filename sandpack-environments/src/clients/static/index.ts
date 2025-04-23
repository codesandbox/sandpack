import { InMemoryFileSystem } from "../../InMemoryFileSystem.js";
import type {
  SandpackEnvironment,
  SandpackEnvironmentStatus,
  SandpackPreview,
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";
import { debounce } from "../../utils";

import { SandpackStaticPreview } from "./StaticPreview.js";

export interface SandpackStaticEnvironmentOptions {
  bundlerURL?: string;
  externalResources?: string[];
}

export class SandpackStaticEnvironment implements SandpackEnvironment {
  readonly type = "static";
  private previews = new Map<HTMLIFrameElement, SandpackStaticPreview>();
  private statusSubscribers = new Set<
    (status: SandpackEnvironmentStatus) => void
  >();
  status: SandpackEnvironmentStatus = {
    current: "LOADING",
    progress: [],
  };
  fs = new InMemoryFileSystem();

  constructor(private options: SandpackStaticEnvironmentOptions) {
    this.fs.watch(
      debounce(() => {
        this.previews.forEach((preview) => {
          preview.compile();
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
    const staticPreview = new SandpackStaticPreview(
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
        return staticPreview.onMessage(subscriber);
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
