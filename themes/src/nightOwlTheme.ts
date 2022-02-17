import type { SandpackTheme } from "./types";

export const nightOwlTheme: SandpackTheme = {
  colors: {
    surface1: "#011627",
    surface2: "#343E4E",
    surface3: "#2D3645",
    clickable: "#6988a1",
    base: "#808080",
    disabled: "#4D4D4D",
    hover: "#c5e4fd",
    accent: "#c5e4fd",
    error: "#811e18",
    errorSurface: "#ffcdca",
  },
  syntax: {
    plain: "#d6deeb",
    comment: { color: "#999999", fontStyle: "italic" },
    keyword: { color: "#c792ea", fontStyle: "italic" },
    tag: "#7fdbca",
    punctuation: "#7fdbca",
    definition: "#82aaff",
    property: { color: "#addb67", fontStyle: "italic" },
    static: "#f78c6c",
    string: "#ecc48d",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "1.4",
  },
};
