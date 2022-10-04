import type { SandpackTheme } from "./types";

// Reference: https://github.com/gruvbox-community/gruvbox
export const gruvboxDark: SandpackTheme = {
  colors: {
    surface1: "#282828",
    surface2: "#3c3836",
    surface3: "#3c3836",
    clickable: "#ebdbb2",
    base: "#ebdbb2",
    disabled: "#928374",
    hover: "#fe8019",
    accent: "#d65d0e",
    error: "#ff453a",
    errorSurface: "#3c3836",
  },
  syntax: {
    plain: "#ebdbb2",
    comment: {
      color: "#928374",
      fontStyle: "italic",
    },
    keyword: "#ff453a",
    tag: "#83a598",
    punctuation: "#ebdbb2",
    definition: "#83a598",
    property: "#fabd2f",
    static: "#ebdbb2",
    string: "#b8bb26",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
