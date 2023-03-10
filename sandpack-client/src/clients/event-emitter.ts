import type { ListenerFunction, UnsubscribeFunction } from "../../types";

import type { SandpackNodeMessage } from "./types";

export class EventEmitter {
  private listeners: Record<number, ListenerFunction> = {};
  private listenersCount = 0;

  readonly channelId: number = Math.floor(Math.random() * 1000000);

  constructor() {
    this.listeners = [];
  }

  cleanup(): void {
    this.listeners = {};
    this.listenersCount = 0;
  }

  dispatch(message: SandpackNodeMessage): void {
    Object.values(this.listeners).forEach((listener) => listener(message));
  }

  listener(listener: ListenerFunction): UnsubscribeFunction {
    if (typeof listener !== "function") {
      return (): void => {
        return;
      };
    }

    const listenerId = this.listenersCount;
    this.listeners[listenerId] = listener;
    this.listenersCount++;
    return (): void => {
      delete this.listeners[listenerId];
    };
  }
}
