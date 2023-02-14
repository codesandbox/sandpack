import { useClasser } from "@code-hike/classer";
import * as React from "react";
import { useSandpack } from "../../hooks";

import { useErrorMessage } from "../../hooks/useErrorMessage";
import { THEME_PREFIX } from "../../styles";
import {
  absoluteClassName,
  buttonClassName,
  errorClassName,
  errorMessageClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { SignInIcon } from "../icons";

/**
 * @category Components
 */
export const ErrorOverlay: React.FC<
  React.DOMAttributes<HTMLDivElement> & { children?: React.ReactNode }
> = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const errorMessage = useErrorMessage();
  const { dispatch } = useSandpack();
  const c = useClasser(THEME_PREFIX);

  if (!errorMessage && !children) {
    return null;
  }

  const onSignIn = () => {
    dispatch({ type: "sign-in" });
  };

  if (errorMessage?.includes("NPM_REGISTRY_UNAUTHENTICATED_REQUEST")) {
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

        <p className={classNames(c("error-message"), errorMessageClassName)}>
          Authentication required. Please sign in to your account and try again.
          If the issue persists, contact{" "}
          <a
            className={classNames(c("error-message"), errorMessageClassName)}
            href="mailto:hello@codesandbox.io?subject=Sandpack Timeout Error"
          >
            support
          </a>{" "}
          for further assistance.
        </p>

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
      <div className={classNames(c("error-message"), errorMessageClassName)}>
        {errorMessage || children}
      </div>
    </div>
  );
};
