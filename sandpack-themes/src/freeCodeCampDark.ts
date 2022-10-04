import type { SandpackTheme } from "./types";

export const freeCodeCampDark: SandpackTheme = {
  colors: {
    surface1: "#2a2a40",
    surface2: "#0a0a23",
    surface3: "#3b3b4f",
    clickable: "#dfdfe2",
    base: "#ffffff",
    disabled: "#858591",
    hover: "#ffffff",
    accent: "#dbb8ff",
    error: "#ffffff",
    errorSurface: "#3b3b4f",
  },
  syntax: {
    plain: "#ffffff",
    comment: {
      color: "#858591",
      fontStyle: "italic",
    },
    keyword: "#dbb8ff",
    tag: "#f07178",
    punctuation: "#99c9ff",
    definition: "#ffffff",
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
