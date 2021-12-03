import * as React from "react";

import { useSandpack } from "./useSandpack";

/**
 * @category Hooks
 */
export const useErrorMessage = (): string | null => {
  const { sandpack } = useSandpack();
  const { error } = sandpack;

  React.useEffect(() => {
    sandpack.errorScreenRegisteredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return error?.message ?? null;
};
