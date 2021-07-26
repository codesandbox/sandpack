import * as React from "react";

import type { SandpackError } from "../../../sandpack-client/dist";

import { useSandpack } from "./useSandpack";

export const useErrorMessage = (): {
  error: SandpackError[];
  setError: (
    callbackUpdate:
      | ((prev: SandpackError[]) => SandpackError[])
      | SandpackError[]
  ) => void;
} => {
  const { sandpack } = useSandpack();
  const { error, setError } = sandpack;

  React.useEffect(() => {
    sandpack.errorScreenRegisteredRef.current = true;
  }, []);

  return { error, setError };
};
