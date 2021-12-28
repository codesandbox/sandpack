import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useLoadingOverlayState } from "../hooks/useLoadingOverlayState";
import { css, THEME_PREFIX } from "../styles";
import {
  errorOverlayClassName,
  errorClassName,
  errorMessageClassName,
} from "../styles/shared";
import { classNames } from "../utils/classNames";

import { Loading } from "./Loading";

export interface LoadingOverlayProps {
  clientId?: string;
}

const loadingClassName = css({
  backgroundColor: "$colors$defaultBackground",
  zIndex: 5,
});

/**
 * @category Components
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ clientId }) => {
  const loadingOverlayState = useLoadingOverlayState(clientId);
  const c = useClasser(THEME_PREFIX);

  if (loadingOverlayState === "hidden") {
    return null;
  }

  if (loadingOverlayState === "timeout") {
    return (
      <div
        className={classNames(
          c("overlay", "error"),
          errorOverlayClassName,
          errorClassName
        )}
      >
        <div className={classNames(c("error-message"), errorMessageClassName)}>
          Unable to establish connection with the sandpack bundler. Make sure
          you are online or try again later. If the problem persists, please
          report it via{" "}
          <a
            className={classNames(c("error-message"), errorMessageClassName)}
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
          >
            email
          </a>{" "}
          or submit an issue on{" "}
          <a
            className={classNames(c("error-message"), errorMessageClassName)}
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
      className={classNames(
        c("overlay", "loading"),
        errorOverlayClassName,
        loadingClassName
      )}
      style={{
        opacity: loadingOverlayState === "visible" ? 1 : 0,
        transition: "opacity 0.5s ease-out",
      }}
    >
      <Loading />
    </div>
  );
};
