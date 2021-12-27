import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";
import { css, THEME_PREFIX } from "../styles";
import { classNames } from "../utils/classNames";

export const errorOverlayClassName = css({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  top: "0",
  margin: "0",
  overflow: "auto",
  height: "100%",
  zIndex: 3,
});

const errorClassName = css({
  padding: "$space$4",
  whiteSpace: "pre-wrap",
  fontFamily: "$font$mono",
  backgroundColor: "$colors$errorBackground",
});

const errorMessageClassName = css({
  animation: "sp-fade-in 0.15s ease-in",
  color: "$colors$errorForeground",
});

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
