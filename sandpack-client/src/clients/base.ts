import isEqual from "lodash.isequal";

import type {
  ClientOptions,
  SandboxSetup,
  ListenerFunction,
  SandpackMessage,
  UnsubscribeFunction,
} from "../types";

export class SandpackClient {
  /**
   * Sandbox configuration: files, setup, customizations;
   */
  sandboxSetup: SandboxSetup;
  options: ClientOptions;

  /**
   * DOM bindings
   */
  iframe!: HTMLIFrameElement;
  iframeSelector: string | HTMLIFrameElement;

  constructor(
    iframeSelector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    this.options = options;
    this.sandboxSetup = sandboxSetup;
    this.iframeSelector = iframeSelector;
  }

  /**
   * Clients handles
   */
  public updateOptions(options: ClientOptions): void {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updateSandbox();
    }
  }

  public updateSandbox(
    _sandboxSetup = this.sandboxSetup,
    _isInitializationCompile?: boolean
  ): void {
    throw Error("Method not implemented");
  }

  public destroy(): void {
    throw Error("Method not implemented");
  }

  /**
   * Bundler communication
   */
  public dispatch(_message: SandpackMessage): void {
    throw Error("Method not implemented");
  }

  public listen(_listener: ListenerFunction): UnsubscribeFunction {
    throw Error("Method not implemented");
  }
}
