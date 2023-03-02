import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack, useSandpackShell } from "../..";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { css, THEME_PREFIX } from "../../styles";
import {
  absoluteClassName,
  buttonClassName,
  errorClassName,
  errorBundlerClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { RestartIcon } from "../icons";

const mapBundlerErrors = (originalMessage: string): string => {
  const errorMessage = originalMessage.replace("[sandpack-client]: ", "");

  if (/process.exit/.test(errorMessage)) {
    const exitCode = errorMessage.match(/process.exit\((\d+)\)/);

    if (!exitCode) return errorMessage;

    // Crash
    if (Number(exitCode[1]) === 0) {
      return `Server is not running, would you like to start it again?`;
    }

    return `Server has crashed with status code ${exitCode[1]}, would you like to restart the server?`;
  }

  return errorMessage;
};

export const ErrorOverlay: React.FC<
  React.DOMAttributes<HTMLDivElement> & { children?: React.ReactNode }
> = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const errorMessage = useErrorMessage();
  const { restart } = useSandpackShell();
  const {
    sandpack: { runSandpack },
  } = useSandpack();
  const c = useClasser(THEME_PREFIX);

  if (!errorMessage && !children) {
    return null;
  }

  const isSandpackBundlerError = errorMessage?.startsWith("[sandpack-client]");

  if (isSandpackBundlerError && errorMessage) {
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
          <p>{mapBundlerErrors(errorMessage)}</p>

          <div>
            <button
              className={classNames(
                c("button", "icon-standalone"),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName
              )}
              onClick={() => {
                restart();
                runSandpack();
              }}
              title="Restart script"
              type="button"
            >
              <RestartIcon /> <span>Restart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        c("overlay", "error"),
        absoluteClassName,
        errorClassName,
        className
      )}
      translate="no"
      {...props}
    >
      <div className={classNames(c("error-message"), errorMessageClassName)}>
        {errorMessage || children}
      </div>
    </div>
  );
};
