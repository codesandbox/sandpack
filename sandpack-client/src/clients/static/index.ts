import type { FilesMap } from "@codesandbox/nodebox";
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
      getFileContent: (filepath) => {
        const content = this.files.get(filepath);
        if (!content) {
          throw new Error("File not found");
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

      // case "refresh":
      //   await this.setLocationURLIntoIFrame();
      //   break;

      // case "urlback":
      // case "urlforward":
      //   this.iframe?.contentWindow?.postMessage(message, "*");
      //   break;

      default:
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
