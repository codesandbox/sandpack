import type { SandpackTheme } from "./types";

export const oceanBlue: SandpackTheme = {
  colors: {
    surface1: "#151515",
    surface2: "#252525",
    surface3: "#2F2F2F",
    clickable: "#999999",
    base: "#f4eded",
    disabled: "#4D4D4D",
    hover: "#C5C5C5",
    accent: "#4a90e2",
    error: "#5d04a7",
    errorSurface: "#efe6f6",
  },
  syntax: {
    plain: "#FFFFFF",
    comment: {
      color: "#757575",
      fontStyle: "italic",
    },
    keyword: "#4a90e2",
    tag: "#7199c7",
    punctuation: "#ffffff",
    definition: "#b7d3f3",
    property: "#4a90e2",
    static: "#5d04a7",
    string: "#dbe3ec",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
