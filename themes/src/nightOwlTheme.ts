import type { SandpackTheme } from "./types";

export const nightOwlTheme: SandpackTheme = {
  palette: {
    activeText: "rgb(197, 228, 253)",
    defaultText: "rgb(105, 136, 161)",
    inactiveText: "rgb(78, 82, 97)",
    activeBackground: "rgb(58, 62, 77)",
    defaultBackground: "rgb(1, 22, 39)",
    inputBackground: "rgb(11, 41, 66)",
    accent: "#7fdbca",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },
  syntax: {
    plain: "#d6deeb",
    comment: { color: "#999999", fontStyle: "italic" },
    keyword: { color: "#c792ea", fontStyle: "italic" },
    tag: "#7fdbca",
    punctuation: "#7fdbca",
    definition: "#82aaff",
    property: { color: "#addb67", fontStyle: "italic" },
    static: "#f78c6c",
    string: "#ecc48d",
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
