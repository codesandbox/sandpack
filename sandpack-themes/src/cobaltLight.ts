import type { SandpackTheme } from "./types";

export const cobaltLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#EFEFEF",
    surface3: "#F3F3F3",
    clickable: "#808080",
    base: "#323232",
    disabled: "#C5C5C5",
    hover: "#4D4D4D",
    accent: "#f5a623",
    error: "#062a52",
    errorSurface: "#e6eaee",
  },
  syntax: {
    plain: "#151515",
    comment: {
      color: "#999",
      fontStyle: "italic",
    },
    keyword: "#f5a623",
    tag: "#4d4d4d",
    punctuation: "#3B3B3B",
    definition: "#62420e",
    property: "#f5a623",
    static: "#062a52",
    string: "#000000",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
