import type { SandpackTheme } from "./types";

export const amethystLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#ffffff",
    surface3: "#f1f1fb",
    clickable: "#080707",
    base: "#0e0e0e",
    disabled: "#4a4a4a",
    hover: "#9013fe",
    accent: "#810bf2",
    error: "#ffffff",
    errorSurface: "#3b3b4f",
  },
  syntax: {
    plain: "#000000",
    comment: {
      color: "#6c6c6e",
      fontStyle: "italic",
    },
    keyword: "#9013fe",
    tag: "#f07178",
    punctuation: "#3f96f8",
    definition: "#000000",
    property: "#4397f6",
    static: "#f78c6c",
    string: "#57d1b7",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "12px",
    lineHeight: "18px",
  },
};
