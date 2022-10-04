import type { SandpackTheme } from "./types";

export const atomDark: SandpackTheme = {
  colors: {
    surface1: "#282c34",
    surface2: "#21252b",
    surface3: "#2c313c",
    clickable: "#a8b1c2",
    base: "#a8b1c2",
    disabled: "#4d4d4d",
    hover: "#e8effc",
    accent: "#c678dd",
    error: "#e06c75",
    errorSurface: "#ffeceb",
  },
  syntax: {
    plain: "#a8b1c2",
    comment: {
      color: "#757575",
      fontStyle: "italic",
    },
    keyword: "#c678dd",
    tag: "#e06c75",
    punctuation: "#a8b1c2",
    definition: "#62aeef",
    property: "#d19a66",
    static: "#a8b1c2",
    string: "#98c379",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
