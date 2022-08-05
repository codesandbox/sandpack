import type { SandpackTheme } from "./types";

export const monokaiPro: SandpackTheme = {
  colors: {
    surface1: "#2D2A2E",
    surface2: "#444344",
    surface3: "#484747",
    clickable: "#939293",
    base: "#C1C0C1",
    disabled: "#444344",
    hover: "#FCFCFA",
    accent: "#FFD866",
    error: "#ffcdca",
    errorSurface: "#c24038",
  },
  syntax: {
    plain: "rgb(252, 252, 250)",
    comment: { color: "#757575", fontStyle: "italic" },
    keyword: "rgb(255, 97, 136)",
    tag: "rgb(120, 220, 232)",
    punctuation: "rgb(147, 146, 147)",
    definition: "rgb(169, 220, 118)",
    property: { color: "rgb(120, 220, 232)", fontStyle: "italic" },
    static: "rgb(171, 157, 242)",
    string: "rgb(255, 216, 102)",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};
