import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../..";
import {
  useLoadingOverlayState,
  FADE_ANIMATION_DURATION,
} from "../../hooks/useLoadingOverlayState";
import { useSandpackShellStdout } from "../../hooks/useSandpackShellStdout";
import { css, THEME_PREFIX } from "../../styles";
import {
  absoluteClassName,
  buttonClassName,
  errorBundlerClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { StdoutList } from "../Console/StdoutList";
import { RestartIcon } from "../icons";

import { Loading } from "./Loading";

export interface LoadingOverlayProps {
  clientId?: string;

  /**
   * It enforces keeping the loading state visible,
   * which is helpful for external loading states.
   */
  loading?: boolean;

  showOpenInCodeSandbox: boolean;
}

const loadingClassName = css({
  backgroundColor: "$colors$surface1",
});

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
  const {
    sandpack: { runSandpack, environment },
  } = useSandpack();
  const [shouldShowStdout, setShouldShowStdout] = React.useState(false);

  const { logs: stdoutData } = useSandpackShellStdout({});

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShowStdout(true);
    }, 3_000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loadingOverlayState === "HIDDEN") {
    return null;
  }

  if (loadingOverlayState === "TIMEOUT") {
    return (
      <div
        className={classNames(
          c("overlay", "error"),
          absoluteClassName,
          errorBundlerClassName,
          className
        )}
        {...props}
      >
        <div className={classNames(c("error-message"), errorMessageClassName)}>
          <p className={classNames(css({ fontWeight: "bold" }))}>
            Couldn't connect to server
          </p>

          <p>
            This means sandpack cannot connect to the runtime or your network is
            having some issues. Please check the network tab in your browser and
            try again. If the problem persists, report it via{" "}
            <a href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error">
              email
            </a>{" "}
            or submit an issue on{" "}
            <a
              href="https://github.com/codesandbox/sandpack/issues"
              rel="noreferrer noopener"
              target="_blank"
            >
              GitHub.
            </a>
          </p>

          <pre>
            ENV: {environment}
            <br />
            ERROR: TIME_OUT
          </pre>

          <div>
            <button
              className={classNames(
                c("button", "icon-standalone"),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName
              )}
              onClick={runSandpack}
              title="Restart script"
              type="button"
            >
              <RestartIcon /> <span>Try again</span>
            </button>
          </div>
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
      {shouldShowStdout && (
        <div className={stdoutPreview.toString()}>
          <StdoutList data={stdoutData} />
        </div>
      )}
      <Loading showOpenInCodeSandbox={showOpenInCodeSandbox} />
    </div>
  );
};

const stdoutPreview = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "$space$8",
  overflow: "auto",
  opacity: 0.5,
  overflowX: "hidden",
});
