import type { SandpackTheme } from "./types";

export const cobalt2: SandpackTheme = {
  colors: {
    surface1: "#193549",
    surface2: "#0d3a58",
    surface3: "#1f4662",
    clickable: "#aaaaaa",
    base: "#ffffff",
    disabled: "#C5C5C5",
    hover: "#ffffff",
    accent: "#ffc600",
    error: "#a22929",
    errorSurface: "#0d3a58",
  },
  syntax: {
    plain: "#ffffff",
    comment: {
      color: "#0088ff",
      fontStyle: "italic",
    },
    keyword: "#ff9d00",
    tag: "#9effff",
    punctuation: "#e1efff",
    definition: "#ffc600",
    property: "#ffc600",
    static: "#ffee80",
    string: "#a5ff90",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Operator Mono", "Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
