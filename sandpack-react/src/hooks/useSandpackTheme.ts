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
} => {
  const { theme, id, mode } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id, themeMode: mode };
};
