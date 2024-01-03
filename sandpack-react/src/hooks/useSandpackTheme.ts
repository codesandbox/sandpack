import * as React from "react";

import { SandpackThemeContext } from "../styles/themeContext";
import type { SandpackTheme } from "../types";

/**
 * @category Hooks
 */
export const useSandpackTheme = (): {
  theme: SandpackTheme;
  themeId: string;
  themeMode: "dark" | "light" | "auto";
} => {
  const { theme, id, mode } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id, themeMode: mode };
};
