import type { SandpackTheme } from "./types";

export const amethyst: SandpackTheme = {
  colors: {
    surface1: "#000000",
    surface2: "#0a0a23",
    surface3: "#3b3b4f",
    clickable: "#dfdfe2",
    base: "#ffffff",
    disabled: "#858591",
    hover: "#ffffff",
    accent: "#a26cd6",
    error: "#ffffff",
    errorSurface: "#3b3b4f",
  },
  syntax: {
    plain: "#ffffff",
    comment: { 
      color: "#858591", 
      fontStyle: "italic" 
    },
    keyword: "#a26cdd",
    tag: "#f07178",
    punctuation: "#99c9ff",
    definition: "#ffffff",
    property: "#99c9ff",
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
