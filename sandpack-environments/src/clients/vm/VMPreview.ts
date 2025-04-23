import type { SandpackBundlerMessages } from "../../sandpack-bundler-types";
import type {
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";

export class VMPreview {
  private disposers = new Set<() => void>();
  private iframeMessageSubscribers = new Set<
    (message: SandpackPreviewMessage) => void
  >();
  private statusSubscribers = new Set<
    (status: SandpackPreviewStatus) => void
  >();
  private iframe: HTMLIFrameElement;
  private _status: SandpackPreviewStatus = {
    current: "READY",
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
  constructor(iframe: HTMLIFrameElement) {
    this.iframe = this.configureIframe(iframe);
    this.iframe.src = "https://qc7lnq-5173.csb.app";
  }
  // Handles message windows coming from iframes
  private onIframeMessage(evt: MessageEvent): void {
    const message = evt.data;
    if (!message.codesandbox) {
      return;
    }

    // TODO: Dispatch urlchange?
    // this.dispatch(message);

    this.iframeMessageSubscribers.forEach((subscriber) => {
      subscriber(message);
    });
  }

  private configureIframe(iframe: HTMLIFrameElement) {
    if (!iframe.getAttribute("sandbox")) {
      iframe.setAttribute(
        "sandbox",
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock"
      );

      iframe.setAttribute(
        "allow",
        "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-read; clipboard-write; xr-spatial-tracking;"
      );
    }

    if (typeof window !== "undefined") {
      const listener = (evt: MessageEvent) => {
        // skip events originating from different iframes
        if (evt.source !== this.iframe.contentWindow) {
          return;
        }
        this.onIframeMessage(evt);
      };

      window.addEventListener("message", listener);

      this.disposers.add(() => {
        window.removeEventListener("message", listener);
      });
    }

    return iframe;
  }

  onMessage(callback: (message: SandpackPreviewMessage) => void): () => void {
    this.iframeMessageSubscribers.add(callback);
    return () => {
      this.iframeMessageSubscribers.delete(callback);
    };
  }

  onStatusChange(
    callback: (status: SandpackPreviewStatus) => void
  ): () => void {
    this.statusSubscribers.add(callback);
    return () => {
      this.statusSubscribers.delete(callback);
    };
  }

  sendBundlerMessage(message: SandpackBundlerMessages): void {
    this.iframe.contentWindow?.postMessage(message, "*");
  }

  dispose(): void {
    // TODO: Dispose of the preview
  }
}
