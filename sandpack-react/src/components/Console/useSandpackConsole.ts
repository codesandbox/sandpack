import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";

import {
  CLEAR_LOG,
  MAX_MESSAGE_COUNT,
  SYNTAX_ERROR_PATTERN,
} from "./utils/constraints";
import type { SandpackConsoleData } from "./utils/getType";

/**
 * It provides an interface to consume the logs from a sandpack client.
 *
 * @category Hooks
 */
export const useSandpackConsole = (props?: {
  clientId?: string;
  maxMessageCount?: number;
  showSyntaxError?: boolean;
}): { logs: SandpackConsoleData; reset: () => void } => {
  const [logs, setLogs] = React.useState<SandpackConsoleData>([]);
  const { listen } = useSandpack();

  const showSyntaxError = props?.showSyntaxError ?? false;
  const maxMessageCount = props?.maxMessageCount ?? MAX_MESSAGE_COUNT;
  const clientId = props?.clientId;

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "console" && message.codesandbox) {
        const payloadLog = Array.isArray(message.log)
          ? message.log
          : [message.log];

        if (payloadLog.find(({ method }) => method === "clear")) {
          return setLogs([CLEAR_LOG]);
        }

        const logsMessages = showSyntaxError
          ? payloadLog
          : payloadLog.filter((messageItem) => {
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
          const messages = [...prev, ...logsMessages].filter(
            (value, index, self) => {
              return index === self.findIndex((s) => s.id === value.id);
            }
          );

          while (messages.length > MAX_MESSAGE_COUNT) {
            messages.shift();
          }

          return messages;
        });
      }
    }, clientId);

    return unsubscribe;
  }, [showSyntaxError, maxMessageCount, clientId]);

  return { logs, reset: (): void => setLogs([]) };
};
