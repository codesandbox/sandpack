import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useLoadingOverlayState } from "../hooks/useLoadingOverlayState";

import { OpenInCodeSandboxButton } from "./OpenInCodeSandboxButton";

export interface LoadingOverlayProps {
  clientId?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ clientId }) => {
  const loadingOverlayState = useLoadingOverlayState(clientId);
  const c = useClasser("sp");

  if (loadingOverlayState === "hidden") {
    return null;
  }

  if (loadingOverlayState === "timeout") {
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

  return (
    <div
      className={c("overlay", "loading")}
      style={{
        opacity: loadingOverlayState === "visible" ? 1 : 0,
        transition: "opacity 0.5s ease-out",
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
