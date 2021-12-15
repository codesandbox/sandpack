import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";

/**
 * @category Components
 */
export const RunButton = (): JSX.Element | null => {
  const c = useClasser("sp");
  const { sandpack } = useSandpack();

  return (
    <button
      className={c("button")}
      onClick={(): void => sandpack.runSandpack()}
      style={{
        position: "absolute",
        bottom: "var(--sp-space-2)",
        right: "var(--sp-space-2)",
      }}
      type="button"
    >
      <RunIcon />
      Run
    </button>
  );
};
