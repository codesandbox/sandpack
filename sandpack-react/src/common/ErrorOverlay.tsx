import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";
import { THEME_PREFIX } from "../styles";
import {
  errorOverlayClassName,
  errorClassName,
  errorMessageClassName,
} from "../styles/shared";
import { classNames } from "../utils/classNames";

/**
 * @category Components
 */
export const ErrorOverlay = (): JSX.Element | null => {
  const errorMessage = useErrorMessage();
  const c = useClasser(THEME_PREFIX);

  if (!errorMessage) {
    return null;
  }
  return (
    <div
      className={classNames(
        c("overlay", "error"),
        errorOverlayClassName,
        errorClassName
      )}
      translate="no"
    >
      <div className={classNames(c("error-message"), errorMessageClassName)}>
        {errorMessage}
      </div>
    </div>
  );
};
