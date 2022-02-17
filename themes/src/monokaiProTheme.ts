import type { SandpackTheme } from "./types";

export const monokaiProTheme: SandpackTheme = {
  palette: {
    activeText: "rgb(252, 252, 250)",
    defaultText: "rgb(147, 146, 147)",
    inactiveText: "#444344",
    activeBackground: "#444344",
    defaultBackground: "rgb(45, 42, 46)",
    inputBackground: "rgb(25, 24, 26)",
    accent: "rgb(255, 216, 102)",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },
  syntax: {
    plain: "rgb(252, 252, 250)",
    comment: { color: "#757575", fontStyle: "italic" },
    keyword: "rgb(255, 97, 136)",
    tag: "rgb(120, 220, 232)",
    punctuation: "rgb(147, 146, 147)",
    definition: "rgb(169, 220, 118)",
    property: { color: "rgb(120, 220, 232)", fontStyle: "italic" },
    static: "rgb(171, 157, 242)",
    string: "rgb(255, 216, 102)",
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};
