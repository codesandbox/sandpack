import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";
import { css, THEME_PREFIX } from "../styles";
import { actionButtonClassName, buttonClassName } from "../styles/shared";
import { classNames } from "../utils/classNames";

const runButtonClassName = css({
  position: "absolute",
  bottom: "$space$2",
  right: "$space$2",
  paddingRight: "$space$3",
});

/**
 * @category Components
 */
export const RunButton = (): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);
  const { sandpack } = useSandpack();

  return (
    <button
      className={classNames(
        c("button"),
        buttonClassName,
        actionButtonClassName,
        runButtonClassName
      )}
      onClick={sandpack.runSandpack}
      type="button"
    >
      <RunIcon />
      Run
    </button>
  );
};
