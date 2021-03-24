import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";

export const ErrorOverlay: React.FC = () => {
  const errorMessage = useErrorMessage();
  const c = useClasser("sp");

  if (!errorMessage) {
    return null;
  }

  return (
    <div className={c("overlay", "error")}>
      <div className={c("error-message")}>{errorMessage}</div>
    </div>
  );
};
