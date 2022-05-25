import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useCombinedRefs } from "../components/CodeEditor/utils";
import { useSandpack } from "../hooks/useSandpack";
import { css, THEME_PREFIX } from "../styles";
import { absoluteClassName } from "../styles/shared";
import { classNames } from "../utils/classNames";

import { stackClassName } from ".";

/**
 * @category Components
 */
export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  children?: React.ReactNode;
}

/**
 * @hidden
 */
export const layoutClassName = css({
  border: "1px solid $colors$surface2",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  background: "$colors$surface1",
  borderRadius: "$border$radius",
  overflow: "hidden",

  "> *:not(:first-child)": {
    borderLeft: "1px solid $colors$surface2",
    borderTop: "1px solid $colors$surface2",
    marginLeft: "-1px",
    marginTop: "-1px",
    position: "relative",
  },

  [`> *:first-child .${absoluteClassName}`]: {
    borderRight: "1px solid $colors$surface2",
  },

  [`> .${stackClassName}`]: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0",
    minWidth: "350px",
    height: "$layout$height",

    "@media print": {
      height: "auto",
      display: "block",
    },

    "@media screen and (max-width: 768px)": {
      height: "auto",
      minWidth:
        "100% !important;" /* triggers the layout break at the 768px breakpoint, not when the component is less then 700px */,
    },
  },
});

/**
 * @category Components
 */
export const SandpackLayout = React.forwardRef<
  HTMLDivElement,
  SandpackLayoutProps
>(({ children, className, ...props }, ref) => {
  const { sandpack } = useSandpack();
  const c = useClasser(THEME_PREFIX);
  const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);

  return (
    <div
      ref={combinedRef}
      className={classNames(c("layout"), layoutClassName, className)}
      {...props}
    >
      {children}
    </div>
  );
});
