/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params,@typescript-eslint/explicit-module-boundary-types */

import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  UnsubscribeFunction,
} from "../..";
import { nullthrows } from "../..";
import { createError } from "../..";
import { SandpackClient } from "../base";

export class SandpackNode extends SandpackClient {
  // Public
  public iframe!: HTMLIFrameElement;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, {
      ...options,
      bundlerURL: options.bundlerURL,
    });

    // Assign iframes
    this.manageIframes(selector);
  }

  /**
   * Nodebox needs to handle two types of iframes at the same time:
   *
   * 1. Runtime iframe: where the emulator process runs, which is responsible
   *    for creating the other iframes (hidden);
   * 2. Preview iframes: any other node process that contains a PORT (public);
   */
  private manageIframes(selector: string | HTMLIFrameElement): void {
    /**
     * Pick the preview iframe
     */
    if (typeof selector === "string") {
      const element = document.querySelector(selector);

      nullthrows(element, `The element '${selector}' was not found`);

      this.iframe = document.createElement("iframe");
    } else {
      this.iframe = selector;
    }

    nullthrows(
      this.iframe.parentNode,
      `The given iframe does not have a parent.`
    );
  }

  /**
   * Send all messages and events to tell to the
   * consumer that the bundler is ready without any error
   */
  private dispatchDoneMessage(): void {
    // this.dispatch({ type: "done", compilatonError: false });
    // if (this.iframePreviewUrl) {
    //   this.dispatch({
    //     type: "urlchange",
    //     url: this.iframePreviewUrl,
    //     back: false,
    //     forward: false,
    //   });
    // }
  }

  /**
   * PUBLIC Methods
   */

  public updateSandbox(setup: SandboxSetup): any {}

  public async dispatch(): Promise<void> {
    // switch (message.type) {
    //   case "compile":
    //     this.compile(message.modules);
    //     break;
    //   case "refresh":
    //     await this.setLocationURLIntoIFrame();
    //     break;
    //   case "urlback":
    //   case "urlforward":
    //     this.iframe?.contentWindow?.postMessage(message, "*");
    //     break;
    //   case "shell/restart":
    //     this.restartShellProcess();
    //     break;
    //   case "shell/openPreview":
    //     window.open(this.iframePreviewUrl, "_blank");
    //     break;
    //   default:
    //     this.emitter.dispatch(message);
    // }
  }

  // public listen(listener: ListenerFunction) {
  //   // return this.emitter.listener(listener);
  // }

  public destroy(): void {
    // this.emitter.cleanup();
  }
}
