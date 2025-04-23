import * as React from "react";

import { useEnvironment } from "../../contexts/SandpackEnvironmentContext";
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

export interface ErrorOverlayProps {
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  title: string;
  description: string;
  children?: React.ReactNode;
}
export const ErrorOverlay: React.FC<ErrorOverlayProps> = (props) => {
  const { children, attributes, title, description } = props;
  const classNames = useClassNames();

  /*
  const isSandpackBundlerError = errorMessage?.startsWith("[sandpack-client]");
  const privateDependencyError = errorMessage?.includes(
    "NPM_REGISTRY_UNAUTHENTICATED_REQUEST"
  );
  */

  const onSignIn = () => {
    // TODO: Figure out what teamId is for and how it works
    /*
    if (teamId) {
      dispatch({ type: "sign-in", teamId });
    }
      */
  };

  /*
  if (privateDependencyError) {
    return (
      <div
        className={classNames("overlay", [
          classNames("error"),
          absoluteClassName,
          errorBundlerClassName,
          attributes?.className,
        ])}
        {...attributes}
      >
        <p className={classNames("error-message", [errorMessageClassName])}>
          <strong>Unable to fetch required dependency.</strong>
        </p>

        <div className={classNames("error-message", [errorMessageClassName])}>
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
            className={classNames("button", [
              buttonClassName,
              iconStandaloneClassName,
              roundedButtonClassName,
            ])}
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
        className={classNames("overlay", [
          classNames("error"),
          absoluteClassName,
          errorBundlerClassName,
          attributes?.className,
        ])}
        {...attributes}
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
                env.restart();
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
    */

  return (
    <div
      className={classNames("overlay", [
        classNames("error"),
        absoluteClassName,
        errorClassName({ solidBg: true }),
        attributes?.className,
      ])}
      translate="no"
      {...attributes}
    >
      <p className={classNames("error-title", [css({ fontWeight: "bold" })])}>
        {title}
      </p>
      <p
        className={classNames("error-message", [
          errorMessageClassName({ errorCode: true }),
        ])}
      >
        {description}
      </p>
      {children}
    </div>
  );
};
