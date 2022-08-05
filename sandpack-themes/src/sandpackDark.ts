import type { SandpackTheme } from "./types";

export const sandpackDark: SandpackTheme = {
  colors: {
    surface1: "#151515",
    surface2: "#252525",
    surface3: "#2F2F2F",
    clickable: "#999999",
    base: "#808080",
    disabled: "#4D4D4D",
    hover: "#C5C5C5",
    accent: "#90e86f",
    error: "#E1CFF8",
    errorSurface: "#b08df8",
  },
  syntax: {
    plain: "#f0fdaf",
    comment: {
      color: "#757575",
      fontStyle: "italic",
    },
    keyword: "#e5fd78",
    tag: "#f0fdaf",
    punctuation: "#ffffff",
    definition: "#eeeeee",
    property: "#90e86f",
    static: "#ffffff",
    string: "#dafecf",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
