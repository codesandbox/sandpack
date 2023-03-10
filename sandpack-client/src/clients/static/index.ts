import type {
  ClientOptions,
  ListenerFunction,
  SandboxSetup,
  SandpackMessage,
  UnsubscribeFunction,
} from "../..";
import { SandpackClient } from "../base";
import { EventEmitter } from "../event-emitter";

export class SandpackRuntime extends SandpackClient {
  private emitter: EventEmitter;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxSetup: SandboxSetup,
    options: ClientOptions = {}
  ) {
    super(selector, sandboxSetup, options);

    this.emitter = new EventEmitter();
  }

  public updateSandbox(
    _sandboxSetup = this.sandboxSetup,
    _isInitializationCompile?: boolean
  ): void {
    // Do stuff

    this.dispatch({ type: "done", compilatonError: false });
  }

  /**
   * Bundler communication
   */
  public dispatch(message: SandpackMessage): void {
    switch (message.type) {
      //   case "CUSTOM_STUFF":
      //     this.CUSTOM_STUFF();
      //     break;

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
