import { useClasser } from "@code-hike/classer";
import * as React from "react";

import {
  createTheme,
  css,
  THEME_PREFIX,
  standardizeStitchesTheme,
} from "../styles";
import { standardizeTheme } from "../styles";
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

  variants: {
    variant: {
      dark: { colorScheme: "dark" },
      light: { colorScheme: "light" },
    },
  },

  "@media screen and (min-resolution: 2dppx)": {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  "*": { boxSizing: "border-box" },
  ".sp-wrapper:focus": { outline: "0" },
});

/**
 * @hidden
 */
const SandpackThemeContext = React.createContext<{
  theme: SandpackTheme;
  id: string;
  mode: "dark" | "light";
}>({
  theme: defaultLight,
  id: "light",
  mode: "light",
});

/**
 * @category Theme
 */
const SandpackThemeProvider: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    theme?: SandpackThemeProp;
    children?: React.ReactNode;
  }
> = ({ theme: themeFromProps, children, className, ...props }) => {
  const { theme, id, mode } = standardizeTheme(themeFromProps);
  const c = useClasser(THEME_PREFIX);

  const themeClassName = React.useMemo(() => {
    return createTheme(id, standardizeStitchesTheme(theme));
  }, [theme, id]);

  return (
    <SandpackThemeContext.Provider value={{ theme, id, mode }}>
      <div
        className={classNames(
          c("wrapper"),
          themeClassName.toString(),
          wrapperClassName({ variant: mode }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SandpackThemeContext.Provider>
  );
};

/**
 * @hidden
 */
const SandpackThemeConsumer = SandpackThemeContext.Consumer;

export { SandpackThemeProvider, SandpackThemeConsumer, SandpackThemeContext };
