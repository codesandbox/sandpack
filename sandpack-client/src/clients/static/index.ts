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

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxSetup, options);

    this.emitter = new EventEmitter();
    this.previewController = new PreviewController({
      baseUrl: "https://nh3fd7-3000.preview.csb.app/",
      getFileContent: (filepath) => {
        const content = this.files.get(filepath);
        if (!content) {
          throw new Error("File not found");
        }
        return content;
      },
    });
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
