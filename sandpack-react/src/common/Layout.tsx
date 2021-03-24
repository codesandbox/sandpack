import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { SandpackThemeProvider } from "../contexts/themeContext";
import { useSandpack } from "../hooks/useSandpack";
import type { SandpackThemeProp } from "../types";

export interface SandpackLayoutProps {
  theme?: SandpackThemeProp;
}

export const SandpackLayout: React.FC<SandpackLayoutProps> = ({
  children,
  theme,
}) => {
  const { sandpack } = useSandpack();
  const c = useClasser("sp");

  return (
    <SandpackThemeProvider theme={theme}>
      <div ref={sandpack.lazyAnchorRef} className={c("layout")}>
        {children}
      </div>
    </SandpackThemeProvider>
  );
};
