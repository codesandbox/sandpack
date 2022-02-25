import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";
import { THEME_PREFIX } from "../styles";
import {
  absoluteClassName,
  errorClassName,
  errorMessageClassName,
} from "../styles/shared";
import { classNames } from "../utils/classNames";

/**
 * @category Components
 */
export const ErrorOverlay = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const errorMessage = useErrorMessage();
  const c = useClasser(THEME_PREFIX);

  if (!errorMessage) {
    return null;
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
        {errorMessage}
      </div>
    </div>
  );
};
