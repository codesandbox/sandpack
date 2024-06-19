import type { WorkerStatusUpdate } from "@codesandbox/nodebox";
import * as React from "react";

import { useSandpack } from "./useSandpack";

const mapProgressMessage = (
  originalMessage: WorkerStatusUpdate & { command?: string },
  firstTotalPending: number
): string | null => {
  switch (originalMessage.state) {
    case "downloading_manifest":
      return "[1/3] Downloading manifest";

    case "downloaded_module":
      return `[2/3] Downloaded ${originalMessage.name} (${
        firstTotalPending - originalMessage.totalPending
      }/${firstTotalPending})`;

    case "starting_command":
      return "[3/3] Starting command";

    case "command_running":
      return `[3/3] Running "${originalMessage.command?.trim()}"`;
  }
};

export const useSandpackPreviewProgress = (
  props:
    | {
        timeout?: number;
        clientId?: string;
      }
    | undefined
) => {
  const [isReady, setIsReady] = React.useState(false);
  const [totalDependencies, setTotalDependencies] = React.useState<number>();
  const [loadingMessage, setLoadingMessage] = React.useState<null | string>(
    null
  );

  const timeout = props?.timeout;
  const clientId = props?.clientId;

  const { listen } = useSandpack();

  React.useEffect(() => {
    let timer: NodeJS.Timer;
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.firstLoad) {
        setIsReady(false);
      }

      if (timeout) {
        timer = setTimeout(() => {
          setLoadingMessage(null);
        }, timeout);
      }

      if (message.type === "dependencies") {
        setLoadingMessage(() => {
          switch (message.data.state) {
            case "downloading_manifest":
              return "[1/3] Downloading manifest";

            case "downloaded_module":
              return `[2/3] Downloaded ${message.data.name} (${message.data.progress}/${message.data.total})`;

            case "starting":
              return "[3/3] Starting";
          }

          return null;
        });
      } else if (message.type === "shell/progress" && !isReady) {
        if (!totalDependencies && message.data.state === "downloaded_module") {
          setTotalDependencies(message.data.totalPending);
        }

        if (totalDependencies !== undefined) {
          setLoadingMessage(
            mapProgressMessage(message.data, totalDependencies)
          );
        }
      }

      if (message.type === "done" && message.compilatonError === false) {
        setLoadingMessage(null);
        setIsReady(true);
        clearTimeout(timer);
      }
    }, clientId);

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }
      unsubscribe();
    };
  }, [clientId, isReady, totalDependencies, timeout]);

  return loadingMessage;
};
