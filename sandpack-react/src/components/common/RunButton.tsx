import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css } from "../../styles";
import { RunIcon } from "../icons";

import { RoundedButton } from "./RoundedButton";

const runButtonClassName = css({
  position: "absolute",
  bottom: "$space$2",
  right: "$space$2",
  paddingRight: "$space$3",
});

export const RunButton: React.FC<
  React.PropsWithChildren & React.ButtonHTMLAttributes<unknown>
> = ({ className, onClick, ...props }) => {
  const { sandpack } = useSandpack();

  return (
    <RoundedButton
      className={runButtonClassName.toString()}
      onClick={(event): void => {
        sandpack.runSandpack();
        onClick?.(event);
      }}
      {...props}
    >
      <RunIcon />
      <span>Run</span>
    </RoundedButton>
  );
};
