import type * as sandpackEnv from "@codesandbox/sandpack-environments";
import * as React from "react";
export type LoadingOverlayState =
  | "LOADING"
  | "PRE_FADING"
  | "FADING"
  | "HIDDEN";

export const FADE_ANIMATION_DURATION = 200;

/**
 * @category Hooks
 */
export const useLoadingOverlayState = (
  preview: sandpackEnv.SandpackPreview
): LoadingOverlayState => {
  const [state, setState] = React.useState<LoadingOverlayState>(
    preview.status.current === "READY" ? "HIDDEN" : "LOADING"
  );

  /**
   * Sandpack listener
   */
  React.useEffect(() => {
    if (preview.status.current === "READY") {
      return;
    }

    return preview.onStatusChange((status) => {
      if (status.current === "READY") {
        setState((prev) => {
          return prev === "LOADING" ? "PRE_FADING" : "HIDDEN";
        });
      }
    });
  }, [preview, state]);

  /**
   * Fading transient state
   */
  React.useEffect(() => {
    let fadeTimeout: NodeJS.Timer;

    if (state === "PRE_FADING") {
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
  }, [state]);

  return state;
};
