import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackThemeProvider } from "../contexts/themeContext";
import { useSandpack } from "../hooks/useSandpack";
import { css, THEME_PREFIX } from "../styles";
import type { SandpackThemeProp } from "../types";
import { classNames } from "../utils/classNames";

export interface SandpackLayoutProps extends React.HtmlHTMLAttributes<unknown> {
  theme?: SandpackThemeProp;
}

const layout = css({
  border: "1px solid $colors$inactiveText",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "stretch",
  background: "$default$Background",
  borderRadius: "$border$radius",
  overflow: "hidden",
  WebkitMaskImage:
    "-webkit-radial-gradient(\n    var(--sp-colors-inputBackground),\n    var(--sp-colors-defaultBackground)\n  )",
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
        className={classNames(c("layout"), layout)}
        {...props}
      >
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
