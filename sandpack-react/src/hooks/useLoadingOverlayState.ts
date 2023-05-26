import * as React from "react";

import { useSandpack } from "./useSandpack";

export type LoadingOverlayState =
  | "LOADING"
  | "PRE_FADING"
  | "FADING"
  | "HIDDEN"
  | "TIMEOUT";

export const FADE_ANIMATION_DURATION = 200;

/**
 * @category Hooks
 */
export const useLoadingOverlayState = (
  clientId?: string,
  externalLoading?: boolean
): LoadingOverlayState => {
  const { sandpack, listen } = useSandpack();
  const [state, setState] = React.useState<LoadingOverlayState>("LOADING");

  /**
   * Sandpack listener
   */
  React.useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.firstLoad === true) {
        setState("LOADING");
      }

      if (message.type === "done") {
        setState((prev) => {
          return prev === "LOADING" ? "PRE_FADING" : "HIDDEN";
        });
      }
    }, clientId);

    return (): void => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, sandpack.status === "idle"]);

  /**
   * Fading transient state
   */
  React.useEffect(() => {
    let fadeTimeout: NodeJS.Timer;

    if (state === "PRE_FADING" && !externalLoading) {
      setState("FADING");
    } else if (state === "FADING") {
      fadeTimeout = setTimeout(
        () => setState("HIDDEN"),
        FADE_ANIMATION_DURATION
      );
    }

    return (): void => {
      clearTimeout(fadeTimeout);
    };
  }, [state, externalLoading]);

  if (sandpack.status === "timeout") {
    return "TIMEOUT";
  }

  if (sandpack.status !== "running") {
    return "HIDDEN";
  }

  return state;
};
