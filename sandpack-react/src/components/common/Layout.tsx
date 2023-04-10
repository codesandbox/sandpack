import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { useCombinedRefs } from "../CodeEditor/utils";

import { stackClassName } from "./Stack";

export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  children?: React.ReactNode;
}

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
    height: "$layout$height",
    overflow: "hidden",

    "@media print": {
      height: "auto",
      display: "block",
    },

    "@media screen and (max-width: 768px)": {
      [`&:not(.${THEME_PREFIX}-preview, .${THEME_PREFIX}-editor, .${THEME_PREFIX}-preset-column)`]:
        {
          height: "calc($layout$height / 2)",
        },

      /* triggers the layout break at the 768px breakpoint, not when the component is less then 700px */
      minWidth: "100%;",
    },
  },

  [`> .${THEME_PREFIX}-file-explorer`]: {
    flex: 0.2,
    minWidth: 200,

    "@media screen and (max-width: 768px)": {
      flex: 1,
    },
  },
});

export const SandpackLayout = React.forwardRef<
  HTMLDivElement,
  SandpackLayoutProps
>(({ children, className, ...props }, ref) => {
  const { sandpack } = useSandpack();
  const classNames = useClassNames();
  const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);

  return (
    <div
      ref={combinedRef}
      className={classNames("layout", [layoutClassName, className])}
      {...props}
    >
      {children}
    </div>
  );
});
