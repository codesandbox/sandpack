import type * as sandpackEnv from "@codesandbox/sandpack-environments";
import * as React from "react";

import { useEnvironment } from "../../contexts/SandpackEnvironmentContext";
import {
  useLoadingOverlayState,
  FADE_ANIMATION_DURATION,
} from "../../hooks/useLoadingOverlayState";
import { css } from "../../styles";
import {
  absoluteClassName,
  buttonClassName,
  errorBundlerClassName,
  errorClassName,
  errorMessageClassName,
  fadeIn,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
import { RestartIcon } from "../icons";

import { Loading } from "./Loading";

export interface LoadingOverlayProps {
  showOpenInCodeSandbox: boolean;
  preview: sandpackEnv.SandpackPreview;
}

const loadingClassName = css({
  backgroundColor: "$colors$surface1",
});

export const LoadingOverlay: React.FC<
  LoadingOverlayProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  className,
  style,
  showOpenInCodeSandbox,
  preview,
  ...props
}): JSX.Element | null => {
  const env = useEnvironment();
  const classNames = useClassNames();

  // const progressMessage = useSandpackPreviewProgress(preview);
  const loadingOverlayState = useLoadingOverlayState(preview);
  // TODO: NodeBox should rather put progress messages in the status of the preview
  // const { logs: stdoutData } = useSandpackShellStdout({ clientId });

  // TODO: Forking is a status of the environment
  // const forking = progressMessage?.toLowerCase().includes("forking");

  /*
  React.useEffect(() => {
    let timer: NodeJS.Timer;
    if (progressMessage?.includes("Running")) {
      timer = setTimeout(() => {
        setShouldShowStdout(true);
      }, 3_000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [progressMessage]);
    */

  if (loadingOverlayState === "HIDDEN" /*&& !forking*/) {
    return null;
  }

  if (preview.status.current === "ERROR") {
    return (
      <div
        className={classNames("overlay", [
          classNames("error"),
          absoluteClassName,
          errorClassName,
          errorBundlerClassName,
          className,
        ])}
        {...props}
      >
        <div className={classNames("error-message", [errorMessageClassName])}>
          <p
            className={classNames("error-title", [css({ fontWeight: "bold" })])}
          >
            Couldn't connect to server
          </p>

          <div className={classNames("error-message", [errorMessageClassName])}>
            <p>
              This means sandpack cannot connect to the runtime or your network
              is having some issues. Please check the network tab in your
              browser and try again. If the problem persists, report it via{" "}
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
          </div>

          <p
            className={classNames("error-message", [
              errorMessageClassName({ errorCode: true }),
            ])}
          >
            ERROR: TIME_OUT
          </p>

          <div>
            <button
              className={classNames("button", [
                classNames("icon-standalone"),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName,
              ])}
              onClick={() => env.restart()}
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
    <>
      <div
        className={classNames("overlay", [
          classNames("loading"),
          absoluteClassName,
          loadingClassName,
          className,
        ])}
        style={{
          ...style,
          // opacity: stillLoading ? 1 : forking ? 0.7 : 0,
          opacity: stillLoading ? 1 : 0,
          transition: `opacity ${FADE_ANIMATION_DURATION}ms ease-out`,
        }}
        {...props}
      >
        {/*
        TODO: What is this specifically? Part of loading the preview?
        shouldShowStdout && (
          <div className={stdoutPreview.toString()}>
            <StdoutList data={stdoutData} />
          </div>
        )*/}
        <Loading showOpenInCodeSandbox={showOpenInCodeSandbox} />
      </div>

      {preview.status.current === "LOADING" && (
        <div className={progressClassName.toString()}>
          <p>{preview.status.progress[preview.status.progress.length - 1]}</p>
        </div>
      )}
    </>
  );
};

/*
const stdoutPreview = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "$space$8",
  overflow: "auto",
  opacity: 0.5,
  overflowX: "hidden",
});
*/
const progressClassName = css({
  position: "absolute",
  left: "$space$5",
  bottom: "$space$4",
  zIndex: "$top",
  color: "$colors$clickable",
  animation: `${fadeIn} 150ms ease`,
  fontFamily: "$font$mono",
  fontSize: ".8em",
  width: "75%",
  p: {
    whiteSpace: "nowrap",
    margin: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});
