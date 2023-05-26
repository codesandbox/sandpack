import { dequal as deepEqual } from "dequal";

import type { ClientStatus } from "..";
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
  status: ClientStatus = "idle";

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
    if (!deepEqual(this.options, options)) {
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
