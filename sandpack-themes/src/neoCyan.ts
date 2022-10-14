import type { SandpackTheme } from "./types";

export const neoCyan: SandpackTheme = {
  colors: {
    surface1: "#282727",
    surface2: "#acf9e4",
    surface3: "#4a4a4a",
    clickable: "#54edcb",
    base: "#963d3d",
    disabled: "#9b9b9b",
    hover: "#C5C5C5",
    accent: "#0971F1",
    error: "#ff0c00",
    errorSurface: "#d8fcf4",
  },
  syntax: {
    plain: "#50e3c2",
    comment: {
      color: "#ffcd00",
      fontStyle: "italic",
    },
    keyword: "#fc8492",
    tag: "#7ed321",
    punctuation: "#ffffff",
    definition: "#68a8fa",
    property: "#0971F1",
    static: "#4a90e2",
    string: "#d699f5",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "22px",
  },
};
