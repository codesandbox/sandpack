import type { FilesMap } from "@codesandbox/nodebox";
import type { FileContent } from "static-browser-server";
import { PreviewController } from "static-browser-server";

import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  UnsubscribeFunction,
} from "../..";
import { SandpackClient } from "../base";
import { EventEmitter } from "../event-emitter";
import { fromBundlerFilesToFS } from "../node/client.utils";
import type { SandpackNodeMessage } from "../node/types";

import { insertHtmlAfterRegex, readBuffer, writeBuffer } from "./utils";

const INDEX_FILENAMES = ["index.html", "index.htm"];

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

    this.emitter = new EventEmitter();
    this.previewController = new PreviewController({
      baseUrl:
        options.bundlerURL ??
        "https://preview.sandpack-static-server.codesandbox.io",
      // filepath is always normalized to start with / and not end with a slash
      getFileContent: (filepath) => {
        let content = this.files.get(filepath);

        if (!content) {
          content = this.getIndexContent(filepath);
        }
        const isHTMLFilePath =
          filepath.endsWith(".html") ||
          filepath.endsWith(".htm") ||
          filepath.endsWith("/");

        if (isHTMLFilePath) {
          content = this.injectProtocolScript(content);
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
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      );

      this.iframe.setAttribute(
        "allow",
        "accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi;"
      );
    }
  }

  private injectProtocolScript(content: FileContent): FileContent {
    const scriptToInsert = `<script>
  window.addEventListener("message", (message) => {
    if(message.data.type === "refresh") {
      window.location.reload();
    }
  })
</script>`;

    // Make it a string
    content = readBuffer(content);

    // Inject script
    content =
      insertHtmlAfterRegex(/<head[^<>]*>/g, content, "\n" + scriptToInsert) ??
      insertHtmlAfterRegex(
        /<html[^<>]*>/g,
        content,
        "<head>\n" + scriptToInsert + "</head>\n"
      ) ??
      scriptToInsert + "\n" + content;

    return writeBuffer(content);
  }

  private getIndexContent(filepath: string): string | Uint8Array {
    const rootDir = filepath === "/" ? filepath : filepath + "/";
    for (const indexFilename of INDEX_FILENAMES) {
      const fullPath = rootDir + indexFilename;
      const foundFile = this.files.get(fullPath);
      if (foundFile) {
        return foundFile;
      }
    }
    if (rootDir === "/") {
      return "<div>File not found</div>";
    } else {
      return this.getIndexContent("/");
    }
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

    this.dispatch({ type: "done", compilatonError: false });
    this.dispatch({
      type: "urlchange",
      url: previewUrl,
      back: false,
      forward: false,
    });
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
  }
}
