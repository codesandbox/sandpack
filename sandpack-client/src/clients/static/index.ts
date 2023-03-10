import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  SandpackMessage,
  UnsubscribeFunction,
} from "../..";
import { SandpackClient } from "../base";

export class SandpackRuntime extends SandpackClient {
  constructor(
    selector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxSetup, options);
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
