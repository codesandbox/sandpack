import * as React from "react";

import { defaultLight } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";
import { useClassNames } from "../utils/classNames";

import { standardizeTheme } from ".";
import { createTheme, css, standardizeStitchesTheme } from ".";

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
  const classNames = useClassNames();

  const themeClassName = React.useMemo(() => {
    return createTheme(id, standardizeStitchesTheme(theme));
  }, [theme, id]);

  return (
    <SandpackThemeContext.Provider value={{ theme, id, mode }}>
      <div
        className={classNames("wrapper", [
          themeClassName,
          wrapperClassName({ variant: mode }),
          className,
        ])}
        {...props}
      >
        {children}
      </div>
    </SandpackThemeContext.Provider>
  );
};

const SandpackThemeConsumer = SandpackThemeContext.Consumer;

export { SandpackThemeProvider, SandpackThemeConsumer, SandpackThemeContext };
