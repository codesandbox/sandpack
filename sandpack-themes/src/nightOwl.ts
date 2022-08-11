import type { SandpackTheme } from "./types";

export const nightOwl: SandpackTheme = {
  colors: {
    surface1: "#011627",
    surface2: "#243b4c",
    surface3: "#112331",
    clickable: "#6988a1",
    base: "#808080",
    disabled: "#4D4D4D",
    hover: "#c5e4fd",
    accent: "#c5e4fd",
    error: "#ffcdca",
    errorSurface: "#811e18",
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
    size: "13px",
    lineHeight: "20px",
  },
};
