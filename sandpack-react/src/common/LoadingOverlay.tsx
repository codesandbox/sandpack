import { useClasser } from "@code-hike/classer";
import * as React from "react";

import {
  useLoadingOverlayState,
  FADE_ANIMATION_DURATION,
} from "../hooks/useLoadingOverlayState";

import { OpenInCodeSandboxButton } from "./OpenInCodeSandboxButton";

export interface LoadingOverlayProps {
  clientId?: string;

  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;
}

/**
 * @category Components
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  clientId,
  loading,
}) => {
  const loadingOverlayState = useLoadingOverlayState(clientId, loading);
  const c = useClasser("sp");

  if (loadingOverlayState === "HIDDEN") {
    return null;
  }

  if (loadingOverlayState === "TIMEOUT") {
    return (
      <div className={c("overlay", "error")}>
        <div className={c("error-message")}>
          Unable to establish connection with the sandpack bundler. Make sure
          you are online or try again later. If the problem persists, please
          report it via{" "}
          <a
            className={c("error-message")}
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
          >
            email
          </a>{" "}
          or submit an issue on{" "}
          <a
            className={c("error-message")}
            href="https://github.com/codesandbox/sandpack/issues"
            rel="noreferrer noopener"
            target="_blank"
          >
            GitHub.
          </a>
        </div>
      </div>
    );
  }

  const stillLoading =
    loadingOverlayState === "LOADING" || loadingOverlayState === "PRE_FADING";

  return (
    <div
      className={c("overlay", "loading")}
      style={{
        opacity: stillLoading ? 1 : 0,
        transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
      }}
    >
      <div className="sp-cube-wrapper" title="Open in CodeSandbox">
        <OpenInCodeSandboxButton />
        <div className="sp-cube">
          <div className="sp-sides">
            <div className="sp-top" />
            <div className="sp-right" />
            <div className="sp-bottom" />
            <div className="sp-left" />
            <div className="sp-front" />
            <div className="sp-back" />
          </div>
        </div>
      </div>
    </div>
  );
};
