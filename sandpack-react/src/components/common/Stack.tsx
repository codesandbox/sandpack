import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";

export const stackClassName = css({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  backgroundColor: "$colors$surface1",
  gap: 1, // border between components

  [`&:has(.${THEME_PREFIX}-stack)`]: {
    backgroundColor: "$colors$surface2",
  },
});

export const SandpackStack: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
> = ({ className, ...props }) => {
  const c = useClasser(THEME_PREFIX);

  return (
    <div
      className={classNames(c("stack"), stackClassName, className)}
      {...props}
    />
  );
};
