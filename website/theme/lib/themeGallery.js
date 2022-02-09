import { defaultLight, defaultDark } from "@codesandbox/sandpack-react";

const amy = {
  colors: {
    surface1: "#200020",
    surface2: "#37021a",
    surface3: "#a080ff",

    clickable: "#3cc9b0",
    base: "#dcdcdc",
    disabled: "#360136",
    hover: "#360136",

    accent: "#3cc9b0",

    error: "#37021a",
    errorSurface: "#37021a",
  },
  syntax: {
    plain: "#3cc9b0",
    comment: {
      color: "#5f8a4d",
      fontStyle: "italic",
    },
    keyword: "#a080ff",
    tag: "#dcdcdc",
    punctuation: "#dcdcdc",
    definition: "#3a857f",
    property: "#9cdbfe",
    static: "#ce9278",
    string: "#999999",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "1.4",
  },
};

const base = {
  colors: {
    surface1: "#FF8A00",
    surface2: "#FF8A00",
    surface3: "#FF8A00",

    clickable: "#FF8A00",
    base: "#FF8A00",
    disabled: "#FF8A00",
    hover: "#FF8A00",

    accent: "#FF8A00",

    error: "#FF8A00",
    errorSurface: "#FF8A00",
  },
  syntax: {
    plain: "#FF8A00",
    comment: {
      color: "#FF8A00",
      fontStyle: "italic",
    },
    keyword: "#FF8A00",
    tag: "#FF8A00",
    punctuation: "#FF8A00",
    definition: "#FF8A00",
    property: "#FF8A00",
    static: "#FF8A00",
    string: "#FF8A00",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "1.4",
  },
};

export const themeGallery = [
  {
    label: "Light",
    code: defaultLight,
  },
  {
    label: "Dark",
    code: defaultDark,
  },
  {
    label: "Amy",
    code: amy,
  },
  {
    label: "Base",
    code: base,
  },
];
