import type { SessionData } from "@codesandbox/sdk";
import { connectToSandbox } from "@codesandbox/sdk/browser";

import type {
  SandpackEnvironment,
  SandpackEnvironmentStatus,
  SandpackPreview,
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";

import { VMFileSystem } from "./VMFileSystem";
import { VMPreview } from "./VMPreview";

export interface SandpackVMEnvironmentOptions {
  session: SessionData;
}

export class SandpackVMEnvironment implements SandpackEnvironment {
  readonly type = "vm";
  private statusSubscribers = new Set<
    (status: SandpackEnvironmentStatus) => void
  >();
  fs: VMFileSystem;
  private _status: SandpackEnvironmentStatus = {
    current: "LOADING",
    progress: [],
  };
  get status() {
    return this._status;
  }
  set status(newStatus) {
    this._status = newStatus;
    this.statusSubscribers.forEach((subscriber) => {
      subscriber(newStatus);
    });
  }

  constructor(private options: SandpackVMEnvironmentOptions) {
    const sandboxPromise = connectToSandbox(options.session);
    this.fs = new VMFileSystem(
      sandboxPromise,
      options.session.user_workspace_path
    );
    sandboxPromise.then(() => {
      this.status = {
        current: "READY",
      };
    });
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
    const vmPreview = new VMPreview(iframe);

    return {
      iframe,
      get status() {
        return vmPreview.status;
      },
      onStatusChange(subscriber: (status: SandpackPreviewStatus) => void) {
        return vmPreview.onStatusChange(subscriber);
      },
      onMessage(subscriber: (message: SandpackPreviewMessage) => void) {
        return vmPreview.onMessage(subscriber);
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
        vmPreview.dispose();
      },
    };
  }

  public dispose() {
    // TODO
  }
}
