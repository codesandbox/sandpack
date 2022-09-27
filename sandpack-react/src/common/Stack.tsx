import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "..";
import { THEME_PREFIX } from "../styles";
import { classNames } from "../utils/classNames";

/**
 * @hidden
 */
export const stackClassName = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  backgroundColor: "$colors$surface1",
  transition: "flex $transitions$default",
  gap: 1, // border between components

  [`&:has(.${THEME_PREFIX}-stack)`]: {
    backgroundColor: "$colors$surface2",
  },
};

/**
 * @category Components
 */
export const SandpackStack: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }
> = ({ className, ...props }) => {
  const c = useClasser(THEME_PREFIX);
  const { css } = useSandpackTheme();

  return (
    <div
      className={classNames(c("stack"), css(stackClassName), className)}
      {...props}
    />
  );
};
