import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useErrorMessage } from "../hooks/useErrorMessage";

export const ErrorOverlay: React.FC = () => {
  const { error } = useErrorMessage();
  const c = useClasser("sp");

  if (error?.length === 0) {
    return null;
  }

  return (
    <div className={c("overlay", "error")}>
      {error.map(({ message, line, column }) => {
        const renderLineColumn = () => {
          if (line && column) {
            return `[${line}:${column}] - `;
          }

          return null;
        };
        return (
          <div key={message} className={c("error-message")}>
            {renderLineColumn()}
            {message}
          </div>
        );
      })}
    </div>
  );
};
