import * as React from "react";

import { useSandpack } from "./useSandpack";

export const useErrorMessage = (): string | null => {
  const { sandpack } = useSandpack();

  React.useEffect(() => {
    sandpack.errorScreenRegisteredRef.current = true;
  }, []);

  const { error } = sandpack;
  if (!error) {
    return null;
  }

  if (error.title === "SyntaxError") {
    return error.message ?? null;
  }

  const errorLocation = error.line ? ` (${error.line}:${error.column})` : ``;
  const errorMessage = `${error.path}: ${error.message}${errorLocation}`;

  return errorMessage ?? null;
};
