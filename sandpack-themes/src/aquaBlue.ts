import type { SandpackTheme } from "./types";

export const aquaBlue: SandpackTheme = {
  colors: {
    surface1: "#f8f9fb",
    surface2: "#EBEDF0",
    surface3: "#e4e7eb",

    clickable: "#737373",
    base: "#323232",
    disabled: "#C5C5C5",
    hover: "#1f2933",

    accent: "#2e7692",
  },

  syntax: {
    plain: "#1F2933",
    comment: { color: "#A7B6C2", fontStyle: "italic" },
    keyword: "#1A56DB",
    tag: "#1A56DB",
    punctuation: "#394b59",
    definition: "#A23DAD",
    property: "#2e7692",
    static: "#1A56DB",
    string: "#1992D4",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
