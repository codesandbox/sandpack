import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack, useSandpackShell } from "../..";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { THEME_PREFIX } from "../../styles";
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
import { SignInIcon } from "../icons";
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
    sandpack: { runSandpack, teamId },
  } = useSandpack();
  const c = useClasser(THEME_PREFIX);
  const { dispatch } = useSandpack();

  if (!errorMessage && !children) {
    return null;
  }

  const isSandpackBundlerError = errorMessage?.startsWith("[sandpack-client]");
  const privateDependencyError = errorMessage?.includes(
    "NPM_REGISTRY_UNAUTHENTICATED_REQUEST"
  );

  const onSignIn = () => {
    dispatch({ type: "sign-in", teamId });
  };

  if (privateDependencyError) {
    return (
      <div
        className={classNames(
          c("overlay", "error"),
          absoluteClassName,
          errorClassName,
          className
        )}
        {...props}
      >
        <p className={classNames(c("error-message"), errorMessageClassName)}>
          <strong>Unable to fetch required dependency.</strong>
        </p>

        <div className={classNames(c("error-message"), errorMessageClassName)}>
          <p>
            Authentication required. Please sign in to your account (make sure
            to allow pop-ups to this page) and try again. If the issue persists,
            contact{" "}
            <a href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error">
              support
            </a>{" "}
            for further assistance.
          </p>
        </div>

        <div>
          <button
            className={classNames(
              c("button"),
              buttonClassName,
              iconStandaloneClassName,
              roundedButtonClassName
            )}
            onClick={onSignIn}
          >
            <SignInIcon />
            <span>Sign in</span>
          </button>
        </div>
      </div>
    );
  }

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
          <p>
            <strong>Couldn't connect to server</strong>
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
        errorClassName({ solidBg: true }),
        className
      )}
      translate="no"
      {...props}
    >
      <p className={classNames(c("error-message"), errorMessageClassName)}>
        <strong>Something went wrong</strong>
      </p>

      <p
        className={classNames(
          c("error-message"),
          errorMessageClassName({ errorCode: true })
        )}
      >
        {errorMessage || children}
      </p>
    </div>
  );
};
