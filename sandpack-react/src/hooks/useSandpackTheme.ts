import * as React from "react";

import { SandpackThemeContext } from "../contexts/themeContext";
import type { SandpackTheme } from "../types";

export const useSandpackTheme = (): {
  theme: SandpackTheme;
  themeId: string;
} => {
  const { theme, id } = React.useContext(SandpackThemeContext);
  return { theme, themeId: id };
};
