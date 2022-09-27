import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "..";
import {
  useLoadingOverlayState,
  FADE_ANIMATION_DURATION,
} from "../hooks/useLoadingOverlayState";
import { THEME_PREFIX } from "../styles";
import {
  absoluteClassName,
  errorClassName,
  errorMessageClassName,
} from "../styles/shared";
import { classNames } from "../utils/classNames";

import { Loading } from "./Loading";

/**
 * @category Components
 */
export interface LoadingOverlayProps {
  clientId?: string;

  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;

  showOpenInCodeSandbox: boolean;
}

const loadingClassName = {
  backgroundColor: "$colors$surface1",
};

/**
 * @category Components
 */
export const LoadingOverlay = ({
  clientId,
  loading,
  className,
  style,
  showOpenInCodeSandbox,
  ...props
}: LoadingOverlayProps &
  React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const loadingOverlayState = useLoadingOverlayState(clientId, loading);
  const c = useClasser(THEME_PREFIX);
  const { css } = useSandpackTheme();

  if (loadingOverlayState === "HIDDEN") {
    return null;
  }

  if (loadingOverlayState === "TIMEOUT") {
    return (
      <div
        className={classNames(
          c("overlay", "error"),
          css(absoluteClassName),
          css(errorClassName),
          css(className)
        )}
        {...props}
      >
        <div
          className={classNames(c("error-message"), css(errorMessageClassName))}
        >
          Unable to establish connection with the sandpack bundler. Make sure
          you are online or try again later. If the problem persists, please
          report it via{" "}
          <a
            className={classNames(
              c("error-message"),
              css(errorMessageClassName)
            )}
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
          >
            email
          </a>{" "}
          or submit an issue on{" "}
          <a
            className={classNames(
              c("error-message"),
              css(errorMessageClassName)
            )}
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
      className={classNames(
        c("overlay", "loading"),
        absoluteClassName,
        loadingClassName,
        className
      )}
      style={{
        ...style,
        opacity: stillLoading ? 1 : 0,
        transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
      }}
      {...props}
    >
      <Loading showOpenInCodeSandbox={showOpenInCodeSandbox} />
    </div>
  );
};
