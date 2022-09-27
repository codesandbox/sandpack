import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "..";
import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";
import { THEME_PREFIX } from "../styles";
import { roundedButtonClassName, buttonClassName } from "../styles/shared";
import { classNames } from "../utils/classNames";

const runButtonClassName = {
  position: "absolute",
  bottom: "$space$2",
  right: "$space$2",
  paddingRight: "$space$3",
};

/**
 * @category Components
 */
export const RunButton = ({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);
  const { sandpack } = useSandpack();
  const { css } = useSandpackTheme();

  return (
    <button
      className={classNames(
        c("button"),
        css(buttonClassName),
        css(roundedButtonClassName),
        css(runButtonClassName),
        className
      )}
      onClick={(event): void => {
        sandpack.runSandpack();
        onClick?.(event);
      }}
      type="button"
      {...props}
    >
      <RunIcon />
      Run
    </button>
  );
};
