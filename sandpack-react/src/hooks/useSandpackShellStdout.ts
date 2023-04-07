import * as React from "react";

import { generateRandomId } from "../utils/stringUtils";

import { useSandpack } from "./useSandpack";

const MAX_MESSAGE_COUNT = 400 * 2;

export const useSandpackShellStdout = ({
  clientId,
  maxMessageCount = MAX_MESSAGE_COUNT,
  resetOnPreviewRestart = false,
}: {
  clientId?: string;
  maxMessageCount?: number;
  resetOnPreviewRestart?: boolean;
}): {
  logs: Array<{ id: string; data: string }>;
  reset: () => void;
} => {
  const [logs, setLogs] = React.useState<Array<{ id: string; data: string }>>(
    []
  );
  const { listen } = useSandpack();

  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "start") {
        setLogs([]);
      } else if (
        message.type === "stdout" &&
        message.payload.data &&
        Boolean(message.payload.data.trim())
      ) {
        setLogs((prev) => {
          const messages = [
            ...prev,
            { data: message.payload.data!, id: generateRandomId() },
          ];

          while (messages.length > maxMessageCount) {
            messages.shift();
          }

          return messages;
        });
      }
    }, clientId);

    return unsubscribe;
  }, [maxMessageCount, clientId]);

  return { logs, reset: (): void => setLogs([]) };
};
