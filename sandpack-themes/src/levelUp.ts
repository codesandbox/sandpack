import type { SandpackTheme } from "./types";

export const levelUp: SandpackTheme = {
  colors: {
    surface1: "#191324",
    surface2: "#261e33",
    surface3: "#524763",
    clickable: "#aaaaaa",
    base: "#ffffff",
    disabled: "#aaaaaa",
    hover: "#ffffff",
    accent: "#82d8d8",
    error: "#e54b4b",
    errorSurface: "#191324",
  },
  syntax: {
    plain: "#ffffff",
    comment: {
      color: "#82d8d8",
      fontStyle: "italic",
    },
    keyword: "#e54b4b",
    tag: "#ff26be",
    punctuation: "#9588aa",
    definition: "#82d8d8",
    property: "#82d8d8",
    static: "#82d8d8",
    string: "#a8fe39",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"MonoLisa", "Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
