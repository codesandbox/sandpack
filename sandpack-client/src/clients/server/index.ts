import {} from "@codesandbox/pitcher-client";

/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "../..";
import type { ClientOptions } from "../base";
import { SandpackClient } from "../base";

const getPitcherInstance = async (branchId = "fzm1q") => {
  const data = await fetch(
    `https://codesandbox.stream/api/beta/sandboxes/branches/${branchId}/instance`,
    {
      method: "POST",
    }
  );

  console.log(data);
};

export class Server extends SandpackClient {
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
        throw new Error(`[server]: the element '${selector}' was not found`);
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

    getPitcherInstance();
  }

  updatePreview(): any {
    console.log("[server]: updatePreview");
  }

  cleanup(): void {
    console.log("[server]: cleanup");
  }

  dispatch(): void {
    console.log("[server]: dispatch");

    return () => {};
  }

  listen(callback): any {
    console.log("[server]: dispatch");

    const message = { type: "done" };

    callback(message);

    return () => {};
  }

  private initializeElement(): void {
    this.iframe.style.border = "0";
    this.iframe.style.width = this.options.width || "100%";
    this.iframe.style.height = this.options.height || "100%";
    this.iframe.style.overflow = "hidden";

    if (!this.element.parentNode) {
      // This should never happen
      throw new Error(`[server]: the given iframe does not have a parent.`);
    }

    this.element.parentNode.replaceChild(this.iframe, this.element);
  }
}
