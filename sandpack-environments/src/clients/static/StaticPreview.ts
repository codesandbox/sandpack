import type { FileContent } from "static-browser-server";
import { PreviewController } from "static-browser-server";

import type { InMemoryFileSystem } from "../../InMemoryFileSystem.js";
// @ts-expect-error // get the bundled file, which contains all dependencies
import consoleHook from "../../inject-scripts/dist/consoleHook.js";
import type { SandpackBundlerMessages } from "../../sandpack-bundler-types";
import type {
  SandpackPreviewMessage,
  SandpackPreviewStatus,
} from "../../types";

import {
  generateRandomId,
  insertHtmlAfterRegex,
  readBuffer,
  validateHtml,
} from "./utils";

import type { SandpackStaticEnvironmentOptions } from "./index.js";

export class SandpackStaticPreview {
  private disposers = new Set<() => void>();
  private iframeMessageSubscribers = new Set<
    (message: SandpackPreviewMessage) => void
  >();
  private statusSubscribers = new Set<
    (status: SandpackPreviewStatus) => void
  >();
  private previewController: PreviewController;
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
  constructor(
    iframe: HTMLIFrameElement,
    private options: SandpackStaticEnvironmentOptions,
    private fs: InMemoryFileSystem
  ) {
    this.previewController = this.createPreviewController();
    this.iframe = this.configureIframe(iframe);
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

  private createPreviewController() {
    return new PreviewController({
      baseUrl:
        this.options.bundlerURL ??
        "https://preview.sandpack-static-server.codesandbox.io",
      // filepath is always normalized to start with / and not end with a slash
      getFileContent: async (filepath) => {
        let content = await this.fs.readFile(filepath);

        if (!content) {
          throw new Error("File not found");
        }
        if (filepath.endsWith(".html") || filepath.endsWith(".htm")) {
          try {
            content = validateHtml(content);
            content = this.injectProtocolScript(content);
            content = this.injectExternalResources(
              content,
              this.options.externalResources
            );
            content = this.injectScriptIntoHead(content, {
              script: consoleHook,
              scope: { channelId: generateRandomId() },
            });
          } catch (err) {
            console.error("Runtime injection failed", err);
          }
        }
        return content;
      },
    });
  }

  private injectContentIntoHead(
    content: FileContent,
    contentToInsert: string
  ): FileContent {
    // Make it a string
    content = readBuffer(content);

    // Inject script
    content =
      insertHtmlAfterRegex(/<head[^<>]*>/g, content, "\n" + contentToInsert) ??
      contentToInsert + "\n" + content;

    return content;
  }

  private injectProtocolScript(content: FileContent): FileContent {
    const scriptToInsert = `<script>
    window.addEventListener("message", (message) => {
      if(message.data.type === "refresh") {
        window.location.reload();
      }
    })
  </script>`;

    return this.injectContentIntoHead(content, scriptToInsert);
  }

  private injectExternalResources(
    content: FileContent,
    externalResources: string[] = []
  ): FileContent {
    const tagsToInsert = externalResources
      .map((resource) => {
        const match = resource.match(/\.([^.]*)$/);
        const fileType = match?.[1];

        if (fileType === "css" || resource.includes("fonts.googleapis")) {
          return `<link rel="stylesheet" href="${resource}">`;
        }

        if (fileType === "js") {
          return `<script src="${resource}"></script>`;
        }

        throw new Error(
          `Unable to determine file type for external resource: ${resource}`
        );
      })
      .join("\n");

    return this.injectContentIntoHead(content, tagsToInsert);
  }

  private injectScriptIntoHead(
    content: FileContent,
    opts: {
      script: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scope?: { channelId: string } & Record<string, any>;
    }
  ): FileContent {
    const { script, scope = {} } = opts;
    const scriptToInsert = `
      <script>
        const scope = ${JSON.stringify(scope)};
        ${script}
      </script>
      `.trim();

    return this.injectContentIntoHead(content, scriptToInsert);
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

  async compile(): Promise<void> {
    const previewUrl = await this.previewController.initPreview();
    this.iframe.setAttribute("src", previewUrl);

    this.sendBundlerMessage({ type: "done", compilatonError: false });
    this.sendBundlerMessage({
      type: "urlchange",
      url: previewUrl,
      back: false,
      forward: false,
    });
  }

  sendBundlerMessage(message: SandpackBundlerMessages): void {
    this.iframe.contentWindow?.postMessage(message, "*");
  }

  dispose(): void {
    // TODO: Dispose of the preview
  }
}
