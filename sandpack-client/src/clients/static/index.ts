/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { FilesMap } from "@codesandbox/nodebox";
import type { FileContent } from "static-browser-server";
import { PreviewController } from "static-browser-server";

import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  UnsubscribeFunction,
} from "../..";
// get the bundled file, which contains all dependencies
// @ts-ignore
import consoleHook from "../../inject-scripts/dist/consoleHook.js";
import { SandpackClient } from "../base";
import { EventEmitter } from "../event-emitter";
import { fromBundlerFilesToFS, generateRandomId } from "../node/client.utils";
import type { SandpackNodeMessage } from "../node/types";

import { insertHtmlAfterRegex, readBuffer, validateHtml } from "./utils";

export class SandpackStatic extends SandpackClient {
  private emitter: EventEmitter;
  private previewController: PreviewController;
  private files: Map<string, string | Uint8Array> = new Map();

  public iframe!: HTMLIFrameElement;
  public selector!: string;
  public element: Element;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxSetup, options);

    this.status = "initializing";

    this.emitter = new EventEmitter();
    this.previewController = new PreviewController({
      baseUrl:
        options.bundlerURL ??
        "https://preview.sandpack-static-server.codesandbox.io",
      // filepath is always normalized to start with / and not end with a slash
      getFileContent: (filepath) => {
        let content = this.files.get(filepath);
        if (!content) {
          throw new Error("File not found");
        }
        if (filepath.endsWith(".html") || filepath.endsWith(".htm")) {
          try {
            content = validateHtml(content);
            content = this.injectProtocolScript(content);
            content = this.injectExternalResources(
              content,
              options.externalResources
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

    if (typeof selector === "string") {
      this.selector = selector;
      const element = document.querySelector(selector);

      this.element = element!;
      this.iframe = document.createElement("iframe");
    } else {
      this.element = selector;
      this.iframe = selector;
    }
    if (!this.iframe.getAttribute("sandbox")) {
      this.iframe.setAttribute(
        "sandbox",
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock"
      );

      this.iframe.setAttribute(
        "allow",
        "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-read; clipboard-write; xr-spatial-tracking;"
      );
    }

    this.eventListener = this.eventListener.bind(this);
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.eventListener);
    }

    // Dispatch very first compile action
    this.updateSandbox();
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
    externalResources: ClientOptions["externalResources"] = []
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

  public updateSandbox(
    setup = this.sandboxSetup,
    _isInitializationCompile?: boolean
  ): void {
    const modules = fromBundlerFilesToFS(setup.files);

    /**
     * Pass init files to the bundler
     */
    this.dispatch({
      codesandbox: true,
      modules,
      template: setup.template,
      type: "compile",
    });
  }

  private async compile(files: FilesMap): Promise<void> {
    this.files = new Map(Object.entries(files));

    const previewUrl = await this.previewController.initPreview();
    this.iframe.setAttribute("src", previewUrl);

    this.status = "done";
    this.dispatch({ type: "done", compilatonError: false });
    this.dispatch({
      type: "urlchange",
      url: previewUrl,
      back: false,
      forward: false,
    });
  }

  // Handles message windows coming from iframes
  private eventListener(evt: MessageEvent): void {
    // skip events originating from different iframes
    if (evt.source !== this.iframe.contentWindow) {
      return;
    }

    const message = evt.data;
    if (!message.codesandbox) {
      return;
    }

    this.dispatch(message);
  }

  /**
   * Bundler communication
   */
  public dispatch(message: SandpackNodeMessage): void {
    switch (message.type) {
      case "compile":
        this.compile(message.modules);
        break;

      default:
        this.iframe.contentWindow?.postMessage(message, "*");
        this.emitter.dispatch(message);
    }
  }

  public listen(listener: ListenerFunction): UnsubscribeFunction {
    return this.emitter.listener(listener);
  }

  public destroy(): void {
    this.emitter.cleanup();
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.eventListener);
    }
  }
}
