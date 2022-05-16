import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";

/**
 * @category Components
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const ErrorOverlay: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
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
