import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackThemeProvider } from "../contexts/themeContext";
import { useSandpack } from "../hooks/useSandpack";
import { css, THEME_PREFIX } from "../styles";
import type { SandpackThemeProp } from "../types";
import { classNames } from "../utils/classNames";

import { errorOverlayClassName, stackClassName } from ".";

export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  theme?: SandpackThemeProp;
}

const layoutClassName = css({
  border: "1px solid $colors$inactiveText",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  background: "$default$Background",
  borderRadius: "$border$radius",
  overflow: "hidden",
  WebkitMaskImage:
    "-webkit-radial-gradient(\n    var(--sp-colors-inputBackground),\n    var(--sp-colors-defaultBackground)\n  )",

  "> *:not(:first-child)": {
    borderLeft: "1px solid $colors$inactiveText",
    borderTop: "1px solid $colors$inactiveText",
    marginLeft: "-1px",
    marginTop: "-1px",
    position: "relative",
  },

  [`> *:first-child ${errorOverlayClassName}`]: {
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
export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  theme,
  ...props
}) => {
  const { sandpack } = useSandpack();
  const c = useClasser(THEME_PREFIX);

  return (
    <SandpackThemeProvider theme={theme}>
      <div
        ref={sandpack.lazyAnchorRef}
        className={classNames(c("layout"), layoutClassName)}
        {...props}
      >
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
