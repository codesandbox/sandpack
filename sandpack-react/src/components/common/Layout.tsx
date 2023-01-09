import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { useCombinedRefs } from "../CodeEditor/utils";
import { stackClassName } from "./Stack";

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
  borderRadius: "$border$radius",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "$colors$surface2",
  gap: 1,

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

      /* triggers the layout break at the 768px breakpoint, not when the component is less then 700px */
      minWidth: "100% !important;",
    },
  },

  [`> .${THEME_PREFIX}-file-explorer`]: {
    flex: 0.2,
    minWidth: 200,
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
