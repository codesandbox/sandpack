import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";
import { THEME_PREFIX } from "../styles";
import { buttonClassName } from "../styles/shared";
import { classNames } from "../utils/classNames";

/**
 * @category Components
 */
export const RunButton = (): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);
  const { sandpack } = useSandpack();

  return (
    <button
      className={classNames(c("button"), buttonClassName)}
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
