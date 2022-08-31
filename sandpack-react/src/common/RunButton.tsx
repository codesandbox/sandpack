import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../hooks/useSandpack";
import { RunIcon } from "../icons";
import { css, THEME_PREFIX } from "../styles";
import { roundedButtonClassName, buttonClassName } from "../styles/shared";
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
export const RunButton = ({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);
  const { sandpack } = useSandpack();

  return (
    <button
      className={classNames(
        c("button"),
        buttonClassName,
        roundedButtonClassName,
        runButtonClassName,
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
