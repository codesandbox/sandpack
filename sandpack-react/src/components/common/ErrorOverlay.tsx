import * as React from "react";

import { useSandpack, useSandpackShell, useErrorMessage } from "../../hooks";
import { css } from "../../styles";
import {
  absoluteClassName,
  buttonClassName,
  errorClassName,
  errorBundlerClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
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

export type ErrorOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};
export const ErrorOverlay: React.FC<ErrorOverlayProps> = (props) => {
  const { children, className, ...otherProps } = props;
  const errorMessage = useErrorMessage();
  const { restart } = useSandpackShell();
  const classNames = useClassNames();
  const {
    sandpack: { runSandpack },
  } = useSandpack();

  if (!errorMessage && !children) {
    return null;
  }

  const isSandpackBundlerError = errorMessage?.startsWith("[sandpack-client]");

  if (isSandpackBundlerError && errorMessage) {
    return (
      <div
        className={classNames("overlay", [
          classNames("error"),
          absoluteClassName,
          errorBundlerClassName,
          className,
        ])}
        {...otherProps}
      >
        <div className={classNames("error-message", [errorMessageClassName])}>
          <p
            className={classNames("error-title", [css({ fontWeight: "bold" })])}
          >
            Couldn't connect to server
          </p>
          <p>{mapBundlerErrors(errorMessage)}</p>

          <div>
            <button
              className={classNames("button", [
                classNames("icon-standalone"),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName,
              ])}
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
      className={classNames("overlay", [
        classNames("error"),
        absoluteClassName,
        errorClassName,
        className,
      ])}
      translate="no"
      {...otherProps}
    >
      <div className={classNames("error-message", [errorMessageClassName])}>
        {errorMessage || children}
      </div>
    </div>
  );
};
