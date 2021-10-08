import * as React from "react";

import { useSandpack } from "./useSandpack";

export type LoadingOverlayState = "visible" | "fading" | "hidden" | "timeout";

const FADE_DELAY = 1000; // 1 second delay one initial load, only relevant if the loading overlay is visible.
const FADE_ANIMATION_DURATION = 500; // 500 ms fade animation

export const useLoadingOverlayState = (
  clientId?: string
): LoadingOverlayState => {
  const { sandpack, listen } = useSandpack();
  const [
    loadingOverlayState,
    setLoadingOverlayState,
  ] = React.useState<LoadingOverlayState>("visible");

  React.useEffect(() => {
    sandpack.loadingScreenRegisteredRef.current = true;
    let innerHook: NodeJS.Timer;
    let outerHook: NodeJS.Timer;

    const unsub = listen((message) => {
      if (message.type === "start" && message.firstLoad === true) {
        setLoadingOverlayState("visible");
      }

      if (message.type === "done") {
        outerHook = setTimeout(() => {
          setLoadingOverlayState(
            (prev) => (prev === "visible" ? "fading" : "hidden") // Only set 'fading' if the current state is 'visible'
          );
          innerHook = setTimeout(
            () => setLoadingOverlayState("hidden"),
            FADE_ANIMATION_DURATION
          );
        }, FADE_DELAY);
      }
    }, clientId);

    return () => {
      clearTimeout(outerHook);
      clearTimeout(innerHook);
      unsub();
    };
  }, []);

  if (sandpack.status === "timeout") {
    return "timeout";
  }

  if (sandpack.status !== "running") {
    return "hidden";
  }

  return loadingOverlayState;
};
