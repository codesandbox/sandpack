/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment,no-console,@typescript-eslint/explicit-function-return-type, no-restricted-globals */
import type { Methods as ConsoleMethod } from "console-feed/lib/definitions/Methods";
import Methods from "console-feed/lib/definitions/Methods";
import Parse from "console-feed/lib/Hook/parse";
import { Encode } from "console-feed/lib/Transform";

declare global {
  const scope: { channelId: string };
}

const targetConsole = window.console as Console & {
  feed?: { pointers: Record<string, unknown> };
  [key: string]: unknown;
};

targetConsole.feed = { pointers: {} };

for (const method of Methods as ConsoleMethod[]) {
  const nativeMethod = targetConsole[method];

  if (typeof nativeMethod !== "function") {
    continue;
  }

  targetConsole[method] = function wrappedConsoleMethod(
    this: Console,
    ...args: unknown[]
  ): void {
    (nativeMethod as (...nativeArgs: unknown[]) => unknown).apply(this, args);

    const parsed = Parse(method, args as any[]);
    if (!parsed) {
      return;
    }

    const encodedMessage = Encode(parsed) as any;
    parent.postMessage(
      {
        type: "console",
        codesandbox: true,
        log: Array.isArray(encodedMessage)
          ? encodedMessage[0]
          : encodedMessage,
        channelId: scope.channelId,
      },
      "*"
    );
  };

  targetConsole.feed.pointers[method] = nativeMethod;
}
