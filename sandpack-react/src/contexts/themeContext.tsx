import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { createTheme, themeClassNameDefault, themeDefault } from "../styles";
import { standardizeTheme } from "../styles";
import { defaultLight } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";

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

/**
 * @category Theme
 */
const SandpackThemeProvider: React.FC<{
  theme?: SandpackThemeProp;
}> = (props) => {
  const { theme, id } = standardizeTheme(props.theme);
  const c = useClasser("sp");

  const themeClassName = React.useMemo(() => {
    return createTheme(
      id ?? themeClassNameDefault,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (theme as any) ?? (themeDefault as any)
    );
  }, [theme, id]);

  return (
    <SandpackThemeContext.Provider
      value={{
        theme,
        id,
      }}
    >
      <div className={c("wrapper", themeClassName.toString())}>
        {props.children}
      </div>
    </SandpackThemeContext.Provider>
  );
};

/**
 * @hidden
 */
const SandpackThemeConsumer = SandpackThemeContext.Consumer;

export { SandpackThemeProvider, SandpackThemeConsumer, SandpackThemeContext };
