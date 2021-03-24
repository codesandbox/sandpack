import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";

export const RunButton: React.FC = () => {
  const c = useClasser("sp");
  const { sandpack } = useSandpack();

  return (
    <button
      className={c("button")}
      onClick={() => sandpack.runSandpack()}
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
