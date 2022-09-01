import { Disposable, Emitter } from "@codesandbox/pitcher-client";

export type WebsocketData = string | Uint8Array;

export class WebsocketClient extends Disposable {
  private ws: WebSocket;

  private onOpenEmitter: Emitter<void> = new Emitter();
  onOpen: Emitter<void>["event"] = this.onOpenEmitter.event;

  private onMessageEmitter: Emitter<WebsocketData> = new Emitter();
  onMessage: Emitter<WebsocketData>["event"] = this.onMessageEmitter.event;

  private onErrorEmitter: Emitter<Error> = new Emitter();
  onError: Emitter<Error>["event"] = this.onErrorEmitter.event;

  constructor(url: string) {
    super();

    this.ws = new WebSocket(url);
  }

  get isConnected(): boolean {
    return this.ws.readyState === this.ws.OPEN;
  }

  get isConnecting(): boolean {
    return this.ws.readyState === this.ws.CONNECTING;
  }

  get isDisconnected(): boolean {
    return this.isDisposed;
  }

  connect(): Promise<void> {
    const promise: Promise<void> = new Promise((resolve, reject) => {
      const disposable = new Disposable();
      const openListener = this.onOpen(() => {
        resolve();
        disposable.dispose();
      });
      disposable.onWillDispose(() => openListener.dispose());

      const closeListener = this.onWillDispose(() => {
        reject(new Error("Websocket connection refused"));
        disposable.dispose();
      });
      disposable.onWillDispose(() => closeListener.dispose());

      if (!disposable.isDisposed) {
        if (this.ws.readyState === this.ws.OPEN) {
          resolve();
          disposable.dispose();
        } else if (this.ws.readyState === this.ws.CLOSED) {
          reject(new Error("Websocket connection refused"));
          disposable.dispose();
        }
      }
    });

    this.onDidDispose(() => {
      if (
        this.ws.readyState !== this.ws.CLOSED &&
        this.ws.readyState !== this.ws.CLOSING
      ) {
        this.ws.close();
      }
    });

    this.ws.addEventListener("close", () => {
      if (!this.isDisposed) {
        this.dispose();
      }
    });

    this.ws.addEventListener("open", () => {
      this.onOpenEmitter.fire();
    });
    this.toDispose.push(this.onOpenEmitter);

    this.ws.addEventListener("message", (event) => {
      this.onMessageEmitter.fire(event.data);
    });
    this.toDispose.push(this.onMessageEmitter);

    this.ws.addEventListener("error", (evt) => {
      console.error(evt);
      this.onErrorEmitter.fire(new Error("Websocket error"));
    });
    this.toDispose.push(this.onErrorEmitter);

    return promise;
  }

  send(data: WebsocketData): void {
    this.ws.send(data);
  }

  close(): void {
    this.ws.close();
  }
}