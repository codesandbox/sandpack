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
    _sandboxSetup = this.sandboxSetup,
    _isInitializationCompile?: boolean
  ): void {
    // Do stuff

    this.dispatch({ type: "done", compilatonError: false });
  }

  private compile(files: FilesMap): void {
    this.files = new Map(Object.entries(files));
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
