import { useClasser } from "@code-hike/classer";
import * as React from "react";

import {
  css,
  createTheme,
  THEME_PREFIX,
  standardizeTheme,
  standardizeStitchesTheme,
} from "../styles";
import { defaultLight } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";
import { classNames } from "../utils/classNames";

const wrapperClassName = css({
  all: "initial",
  fontSize: "$font$size",
  fontFamily: "$font$body",
  display: "block",
  boxSizing: "border-box",
  textRendering: "optimizeLegibility",
  WebkitTapHighlightColor: "transparent",
  WebkitFontSmoothing: "subpixel-antialiased",

  "@media screen and (min-resolution: 2dppx)": {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  "*": { boxSizing: "border-box" },
  ".sp-wrapper:focus": { outline: "0" },
  "*::-webkit-scrollbar": { width: "8px", height: "8px" },
  "*::-webkit-scrollbar-track": {
    backgroundColor: "$colors$defaultBackground",
    borderLeft: "1px solid $colors$inactiveText",
  },
  "*::-webkit-scrollbar-corner": { backgroundColor: "transparent" },
  "*::-webkit-scrollbar-thumb": {
    backgroundColor: "$colors$defaultText",
    borderRadius: "9999px",
    opacity: 0,
  },
  "*::-webkit-scrollbar-thumb:hover": { opacity: 1 },
});

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
  const c = useClasser(THEME_PREFIX);

  const themeClassName = React.useMemo(() => {
    return createTheme(id, standardizeStitchesTheme(theme));
  }, [theme, id]);

  return (
    <SandpackThemeContext.Provider
      value={{
        theme,
        id,
      }}
    >
      <div
        className={classNames(
          c("wrapper"),
          themeClassName.toString(),
          wrapperClassName
        )}
      >
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
