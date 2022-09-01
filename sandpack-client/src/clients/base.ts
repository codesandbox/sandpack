import isEqual from "lodash.isequal";

import type {
  ListenerFunction,
  SandpackMessage,
  UnsubscribeFunction,
} from "..";
import type {
  NpmRegistry,
  ReactDevToolsMode,
  SandboxInfo,
  SandpackLogLevel,
} from "../types";

import type { IFrameProtocol } from "./runtime/iframe-protocol";

export interface ClientOptions {
  /**
   * Paths to external resources
   */
  externalResources?: string[];
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Level of logging to do in the bundler
   */
  logLevel?: SandpackLogLevel;
  /**
   * Relative path that the iframe loads (eg: /about)
   */
  startRoute?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;

  /**
   * Boolean flags to trigger certain UI elements in the bundler
   */
  showOpenInCodeSandbox?: boolean;
  showErrorScreen?: boolean;
  showLoadingScreen?: boolean;

  /**
   * The bundler will clear the console if you set this to true, everytime the iframe refreshes / starts the first compile
   */
  clearConsoleOnFirstCompile?: boolean;

  /**
   * You can pass a custom file resolver that is responsible for resolving files.
   * We will use this to get all files from the file system.
   */
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };

  reactDevTools?: ReactDevToolsMode;

  /**
   * The custom private npm registry setting makes it possible
   * to retrieve npm packages from your own npm registry.
   */
  customNpmRegistries?: NpmRegistry[];
}

export class SandpackClient {
  options: ClientOptions;
  sandboxInfo: SandboxInfo;
  selector: string | HTMLIFrameElement;
  element!: Element;
  iframe!: HTMLIFrameElement;
  iframeProtocol!: IFrameProtocol;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: SandboxInfo,
    options: ClientOptions = {}
  ) {
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.selector = selector;

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

  updateOptions(options: ClientOptions): void {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updatePreview();
    }
  }

  cleanup(): void {
    throw Error("Method not implemented");
  }

  updatePreview(
    _sandboxInfo = this.sandboxInfo,
    _isInitializationCompile?: boolean
  ): void {
    throw Error("Method not implemented");
  }

  dispatch(_message: SandpackMessage): void {
    throw Error("Method not implemented");
  }

  listen(_listener: ListenerFunction): UnsubscribeFunction {
    throw Error("Method not implemented");
  }
}