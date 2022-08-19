import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";

import {
  CLEAR_LOG,
  MAX_MESSAGE_COUNT,
  SYNTAX_ERROR_PATTERN,
} from "./utils/constraints";
import type { SandpackConsoleData } from "./utils/getType";

export const useSandpackConsole = ({
  clientId,
  maxMessageCount = MAX_MESSAGE_COUNT,
  showSyntaxError = false,
}: {
  clientId?: string;
  maxMessageCount?: number;
  showSyntaxError?: boolean;
}): { logs: SandpackConsoleData; reset: () => void } => {
  const [logs, setLogs] = React.useState<SandpackConsoleData>([]);
  const { listen } = useSandpack();

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        if (message.log.find(({ method }) => method === "clear")) {
          return setLogs([CLEAR_LOG]);
        }

        const logsMessages = showSyntaxError
          ? message.log
          : message.log.filter((messageItem) => {
              const messagesWithoutSyntaxErrors = messageItem.data.filter(
                (dataItem) => {
                  if (typeof dataItem !== "string") return true;

                  const matches = SYNTAX_ERROR_PATTERN.filter((lookFor) =>
                    dataItem.startsWith(lookFor)
                  );

                  return matches.length === 0;
                }
              );

              return messagesWithoutSyntaxErrors.length > 0;
            });

        if (!logsMessages) return;

        setLogs((prev) => {
          const messages = [...prev, ...logsMessages];

          while (messages.length > MAX_MESSAGE_COUNT) {
            messages.shift();
          }

          return messages;
        });
      }
    }, clientId);

    return unsubscribe;
  }, [listen, maxMessageCount, clientId, showSyntaxError]);

  return { logs, reset: (): void => setLogs([]) };
};
