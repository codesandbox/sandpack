import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";

/**
 * @category Components
 */
export const ErrorOverlay = (): JSX.Element | null => {
  const errorMessage = useErrorMessage();
  const c = useClasser("sp");

  if (!errorMessage) {
    return null;
  }
  return (
    <div className={c("overlay", "error")} translate="no">
      <div className={c("error-message")}>{errorMessage}</div>
    </div>
  );
};
