import type { SandpackTheme } from "./types";

export const draculaLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#EFEFEF",
    surface3: "#F3F3F3",
    clickable: "#808080",
    base: "#323232",
    disabled: "#C5C5C5",
    hover: "#4D4D4D",
    accent: "#ea00ff",
    error: "#d105f9",
    errorSurface: "#fae6fe",
  },
  syntax: {
    plain: "#151515",
    comment: {
      color: "#999",
      fontStyle: "italic",
    },
    keyword: "#ea00ff",
    tag: "#ac51fd",
    punctuation: "#3B3B3B",
    definition: "#5e0066",
    property: "#ea00ff",
    static: "#d105f9",
    string: "#8906fc",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
