import type { SandpackTheme } from "./types";

// Reference: https://github.com/gruvbox-community/gruvbox
export const gruvboxLight: SandpackTheme = {
  colors: {
    surface1: "#fbf1c7",
    surface2: "#ebdbb2",
    surface3: "#ebdbb2",
    clickable: "#808080",
    base: "#3c3836",
    disabled: "#928374",
    hover: "#af3a03",
    accent: "#d65d0e",
    error: "#9d0006",
    errorSurface: "#ebdbb2",
  },
  syntax: {
    plain: "#3c3836",
    comment: {
      color: "#928374",
      fontStyle: "italic",
    },
    keyword: "#9d0006",
    tag: "#076678",
    punctuation: "#3c3836",
    definition: "#076678",
    property: "#b57614",
    static: "#3c3836",
    string: "#79740e",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
