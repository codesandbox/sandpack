import type { SandpackTheme } from "./types";

export const githubDark: SandpackTheme = {
  colors: {
    surface1: "#0d1117",
    surface2: "#27272a",
    surface3: "#3b3b4f",
    clickable: "#999999",
    base: "#999999",
    disabled: "#4d4d4d",
    hover: "#ffffff",
    accent: "#ffffff",
    error: "#e06c75",
    errorSurface: "#ffeceb",
  },
  syntax: {
    plain: "#c9d1d9",
    comment: {
      color: "#8b949e",
      fontStyle: "italic",
    },
    keyword: "#ff7b72",
    tag: "#7ee787",
    punctuation: "#c9d1d9",
    definition: "#d2a8ff",
    property: "#79c0ff",
    static: "#79c0ff",
    string: "#a5d6ff",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
