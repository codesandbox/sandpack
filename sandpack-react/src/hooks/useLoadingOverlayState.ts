import * as React from "react";

import { useSandpack } from "./useSandpack";

export type LoadingOverlayState = "visible" | "fading" | "hidden" | "timeout";

export const FADE_ANIMATION_DURATION = 200;

/**
 * @category Hooks
 */
export const useLoadingOverlayState = (
  clientId?: string
): LoadingOverlayState => {
  const { sandpack, listen } = useSandpack();
  const [loadingOverlayState, setLoadingOverlayState] =
    React.useState<LoadingOverlayState>("visible");

  React.useEffect(() => {
    sandpack.loadingScreenRegisteredRef.current = true;
    let fadeTimeout: NodeJS.Timer;

    const unsub = listen((message) => {
      if (message.type === "start" && message.firstLoad === true) {
        setLoadingOverlayState("visible");
      }

      if (message.type === "done") {
        setLoadingOverlayState(
          (prev) => (prev === "visible" ? "fading" : "hidden") // Only set 'fading' if the current state is 'visible'
        );
        fadeTimeout = setTimeout(
          () => setLoadingOverlayState("hidden"),
          FADE_ANIMATION_DURATION
        );
      }
    }, clientId);

    return (): void => {
      clearTimeout(fadeTimeout);
      unsub();
    };
  }, [clientId, sandpack.status === "idle"]);

  if (sandpack.status === "timeout") {
    return "timeout";
  }

  if (sandpack.status !== "running") {
    return "hidden";
  }

  return loadingOverlayState;
};
