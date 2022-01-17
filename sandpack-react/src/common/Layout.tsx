import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useCombinedRefs } from "../components/CodeEditor/utils";
import { SandpackThemeProvider } from "../contexts/themeContext";
import { useSandpack } from "../hooks/useSandpack";
import { css, THEME_PREFIX } from "../styles";
import { errorOverlayClassName } from "../styles/shared";
import type { SandpackThemeProp } from "../types";
import { classNames } from "../utils/classNames";

import { stackClassName } from ".";

export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  theme?: SandpackThemeProp;
}

export const layoutClassName = css({
  border: "1px solid $colors$inactiveText",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  background: "$colors$defaultBackground",
  borderRadius: "$border$radius",
  overflow: "hidden",
  WebkitMaskImage:
    "-webkit-radial-gradient($colors$inputBackground,$colors$defaultBackground)",

  "> *:not(:first-child)": {
    borderLeft: "1px solid $colors$inactiveText",
    borderTop: "1px solid $colors$inactiveText",
    marginLeft: "-1px",
    marginTop: "-1px",
    position: "relative",
  },

  [`> *:first-child .${errorOverlayClassName}`]: {
    borderRight: "1px solid $colors$inactiveText",
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
 * @category Theme
 */
export const SandpackLayout = React.forwardRef<
  HTMLDivElement,
  SandpackLayoutProps
>(({ children, theme, className, ...props }, ref) => {
  const { sandpack } = useSandpack();
  const c = useClasser(THEME_PREFIX);
  const combinedRef = useCombinedRefs(sandpack.lazyAnchorRef, ref);

  return (
    <SandpackThemeProvider theme={theme}>
      <div
        ref={combinedRef}
        className={classNames(c("layout"), layoutClassName, className)}
        {...props}
      >
        {children}
      </div>
    </SandpackThemeProvider>
  );
});
