/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "../..";
import type { ClientOptions } from "../base";
import { SandpackClientBase } from "../base";

export class SandpackClientRuntimeServer extends SandpackClientBase {
  element: Element;
  iframe: HTMLIFrameElement;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxInfo, options);

    if (typeof selector === "string") {
      this.selector = selector;
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(
          `[sandpack-client]: the element '${selector}' was not found`
        );
      }

      this.element = element;
      this.iframe = document.createElement("iframe");
      this.initializeElement();
    } else {
      this.element = selector;
      this.iframe = selector;
    }
    if (!this.iframe.getAttribute("sandbox")) {
      this.iframe.setAttribute(
        "sandbox",
        "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      );
    }

    this.iframe.contentWindow?.location.replace(
      "https://en.wikipedia.org/wiki/Main_Page"
    );
  }

  updatePreview(): any {
    console.log("[runtime-server]: updatePreview");
  }

  cleanup(): void {
    console.log("[runtime-server]: cleanup");
  }

  dispatch(): void {
    console.log("[runtime-server]: dispatch");
  }

  listen(): any {
    console.log("[runtime-server]: dispatch");
  }

  private initializeElement(): void {
    this.iframe.style.border = "0";
    this.iframe.style.width = this.options.width || "100%";
    this.iframe.style.height = this.options.height || "100%";
    this.iframe.style.overflow = "hidden";

    if (!this.element.parentNode) {
      // This should never happen
      throw new Error(
        `[sandpack-client]: the given iframe does not have a parent.`
      );
    }

    this.element.parentNode.replaceChild(this.iframe, this.element);
  }
}