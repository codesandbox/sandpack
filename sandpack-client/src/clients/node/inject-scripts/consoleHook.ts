/* eslint-disable @typescript-eslint/ban-ts-comment,no-console,@typescript-eslint/explicit-function-return-type, no-restricted-globals */
import Hook from "console-feed/lib/Hook";
import { Decode } from "console-feed/lib/Transform";

Hook(window.console, (log) => {
  parent.postMessage(
    {
      type: "console",
      codesandbox: true,
      log: Decode(log),
    },
    "*"
  );
});
