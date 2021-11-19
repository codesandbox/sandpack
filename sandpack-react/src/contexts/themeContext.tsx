import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { createThemeObject, defaultLight } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";
import { injectThemeStyleSheet } from "../utils/domUtils";

/**
 * @hidden
 */
const SandpackThemeContext = React.createContext<{
  theme: SandpackTheme;
  id: string;
}>({
  theme: defaultLight,
  id: "light",
});

const SandpackThemeProvider: React.FC<{
  theme?: SandpackThemeProp;
}> = (props) => {
  const { theme, id } = createThemeObject(props.theme);
  const c = useClasser("sp");
  // If theme is not explicitly set, don't inject any stylesheet
  if (props.theme) {
    injectThemeStyleSheet(theme, id);
  }

  return (
    <SandpackThemeContext.Provider
      value={{
        theme,
        id,
      }}
    >
      <div className={c("wrapper", id)}>{props.children}</div>
    </SandpackThemeContext.Provider>
  );
};

/**
 * @hidden
 */
const SandpackThemeConsumer = SandpackThemeContext.Consumer;

export { SandpackThemeProvider, SandpackThemeConsumer, SandpackThemeContext };
