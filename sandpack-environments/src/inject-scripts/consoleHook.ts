/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment,no-console,@typescript-eslint/explicit-function-return-type, no-restricted-globals */
import Hook from "console-feed/lib/Hook";
import { Encode } from "console-feed/lib/Transform";

declare global {
  const scope: { channelId: string };
}

Hook(window.console, (log) => {
  const encodeMessage = Encode(log) as any;
  parent.postMessage(
    {
      type: "console",
      codesandbox: true,
      log: Array.isArray(encodeMessage) ? encodeMessage[0] : encodeMessage,
      channelId: scope.channelId,
    },
    "*"
  );
});
