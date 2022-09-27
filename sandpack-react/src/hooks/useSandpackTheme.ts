import * as React from "react";

import { SandpackThemeContext } from "../contexts/themeContext";
import type { SandpackTheme } from "../types";

/**
 * @category Hooks
 */
export const useSandpackTheme = (): {
  theme: SandpackTheme;
  themeId: string;
  themeMode: "dark" | "light";
  css: any
} => {
  const { theme, id, mode, css } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id, themeMode: mode, css };
};
