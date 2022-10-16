import type { SandpackTheme } from "./types";

export const cyberpunk: SandpackTheme = {
  colors: {
    surface1: "#051c30",
    surface2: "#042f40",
    surface3: "#042f40",
    clickable: "#aaaaaa",
    base: "#ffffff",
    disabled: "#C5C5C5",
    hover: "#ffffff",
    accent: "#fdf500",
    error: "#ff003c",
    errorSurface: "#051c30"
  },
  syntax: {
    plain: "#ffffff",
    comment: {
      color: "#1ac5b0",
      fontStyle: "italic"
    },
    keyword: "#fdf500",
    tag: "#ffc600",
    punctuation: "#afd7fa",
    definition: "#ffc600",
    property: "#fdf500",
    static: "#e455ae",
    string: "#37ebf3"
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px"
  }
};