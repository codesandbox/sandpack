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
    let timeoutHook: NodeJS.Timer;

    const unsub = listen((message) => {
      if (message.type === "start" && message.firstLoad === true) {
        setLoadingOverlayState("visible");
      }

      if (message.type === "done") {
        setLoadingOverlayState("fading");
        timeoutHook = setTimeout(() => setLoadingOverlayState("hidden"), 500); // fade animation
      }
    });

    return () => {
      clearTimeout(timeoutHook);
      unsub();
    };
  }, []);

  if (sandpack.status !== "running") {
    return "hidden";
  }

  return loadingOverlayState;
};
