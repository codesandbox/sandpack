import type { SandpackTheme } from "./types";

export const freeCodeCampLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#e7e7e7",
    surface3: "#ffffff",
    clickable: "#090909",
    base: "#000000",
    disabled: "#858591",
    hover: "#dbb8ff",
    accent: "#8006fc",
    error: "#f96666",
    errorSurface: "#3b3b4f",
  },
  syntax: {
    plain: "#000000",
    comment: {
      color: "#858591",
      fontStyle: "italic",
    },
    keyword: "#7f0bf6",
    tag: "#f07178",
    punctuation: "#99c9ff",
    definition: "#000000",
    property: "#99c9ff",
    static: "#f78c6c",
    string: "#acd157",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
