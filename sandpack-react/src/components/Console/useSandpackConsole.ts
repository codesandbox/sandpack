import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";

import type { SandpackConsoleData } from "./utils";

const MAX_MESSAGE_COUNT = 100;

export const useSandpackConsole = ({
  clientId,
  maxMessageCount = MAX_MESSAGE_COUNT,
}: {
  clientId?: string;
  maxMessageCount?: number;
}): SandpackConsoleData => {
  const [logs, setLogs] = React.useState<SandpackConsoleData>([]);
  const { listen } = useSandpack();

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        setLogs((prev) => {
          const messages = [...prev, ...message.log];
          messages.slice(Math.max(0, messages.length - maxMessageCount));

          return messages;
        });
      }
    }, clientId);

    return unsubscribe;
  }, [listen, maxMessageCount, clientId]);

  return logs;
};
