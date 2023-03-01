import type { WorkerStatusUpdate } from "@codesandbox/nodebox";
import * as React from "react";

import { useSandpack } from "../..";
import { css } from "../../styles";
import { fadeIn } from "../../styles/shared";

const wrapperClassName = css({
  position: "absolute",
  left: "$space$5",
  bottom: "$space$4",
  zIndex: "$top",
  color: "$colors$clickable",
  animation: `${fadeIn} 150ms ease`,
  fontFamily: "$font$mono",
  fontSize: ".8em",
  width: "75%",
  p: {
    whiteSpace: "nowrap",
    margin: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});

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

export const PreviewProgress: React.FC<{
  clientId?: string;
}> = ({ clientId }) => {
  const [isReady, setIsReady] = React.useState(false);
  const [totalDependencies, setTotalDependencies] = React.useState<number>();
  const [loadingMessage, setLoadingMessage] = React.useState<null | string>(
    null
  );
  const { listen } = useSandpack();

  React.useEffect(() => {
    let timer: NodeJS.Timer;
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.firstLoad) {
        setIsReady(false);
      }

      if (message.type === "shell/progress" && !isReady) {
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
  }, [clientId, isReady, totalDependencies]);

  if (!loadingMessage) return null;

  return (
    <div className={wrapperClassName.toString()}>
      <p>{loadingMessage}</p>
    </div>
  );
};
