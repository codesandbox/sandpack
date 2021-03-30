import * as React from "react";

import { useSandpack } from "./useSandpack";

export type LoadingOverlayState = "visible" | "fading" | "hidden";

export const useLoadingOverlayState = (): LoadingOverlayState => {
  const { sandpack, listen } = useSandpack();
  const [
    loadingOverlayState,
    setLoadingOverlayState,
  ] = React.useState<LoadingOverlayState>("visible");

  React.useEffect(() => {
    sandpack.loadingScreenRegisteredRef.current = true;
    let innerTimeoutHook: NodeJS.Timer;
    let outerTimeoutHook: NodeJS.Timer;

    const unsub = listen((message) => {
      if (message.type === "start" && message.firstLoad === true) {
        setLoadingOverlayState("visible");
      }

      if (message.type === "done") {
        outerTimeoutHook = setTimeout(() => {
          setLoadingOverlayState(
            (prev) => (prev === "visible" ? "fading" : "hidden") // Only set 'fading' if the current state is 'visible'
          );
          innerTimeoutHook = setTimeout(
            () => setLoadingOverlayState("hidden"),
            500 // 500 ms fade animation
          );
        }, 1000); // 1 second delay one initial load, only relevant if the loading overlay is visible.
      }
    });

    return () => {
      clearTimeout(outerTimeoutHook);
      clearTimeout(innerTimeoutHook);
      unsub();
    };
  }, []);

  if (sandpack.status !== "running") {
    return "hidden";
  }

  return loadingOverlayState;
};
