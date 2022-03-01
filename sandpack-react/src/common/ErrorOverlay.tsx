import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";

/**
 * @category Components
 */
export const ErrorOverlay: React.FC = ({ children }) => {
  const errorMessage = useErrorMessage();
  const c = useClasser("sp");

  if (!errorMessage && !children) {
    return null;
  }

  return (
    <div className={c("overlay", "error")} translate="no">
      <div className={c("error-message")}>{errorMessage || children}</div>
    </div>
  );
};
