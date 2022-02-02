import type { SandpackTheme } from "./types";

export const sandpackDark: SandpackTheme = {
  palette: {
    activeText: "#90e86f",
    defaultText: "#5a5a5a",
    inactiveText: "#1a1a1a",
    activeBackground: "#272727",
    defaultBackground: "#151515",
    inputBackground: "#2e2e2e",
    accent: "#90e86f",
    errorBackground: "#dac1fb",
    errorForeground: "#b08df8",
  },
  syntax: {
    plain: "#f0fdaf",
    comment: { color: "#757575", fontStyle: "italic" },
    keyword: "#e5fd78",
    tag: "#f0fdaf",
    punctuation: "#ffffff",
    definition: "#eeeeee",
    property: "#90e86f",
    static: "#ffffff",
    string: "#dafecf",
  },
  typography: {
    bodyFont:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Code", "Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.6",
  },
};

export const aquaBlueTheme: SandpackTheme = {
  palette: {
    activeText: "#1f2933",
    defaultText: "#737373",
    inactiveText: "#e4e7eb",
    activeBackground: "#e4e7eb",
    defaultBackground: "#f8f9fb",
    inputBackground: "#ffffff",
    accent: "#6caedd",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },

  syntax: {
    plain: "#1F2933",
    comment: { color: "#A7B6C2", fontStyle: "italic" },
    keyword: "#1A56DB",
    tag: "#1A56DB",
    punctuation: "#394b59",
    definition: "#A23DAD",
    property: "#14919B",
    static: "#1A56DB",
    string: "#1992D4",
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

export const githubLightTheme: SandpackTheme = {
  palette: {
    activeText: "#24292e",
    defaultText: "#959da5",
    inactiveText: "#e4e7eb",
    activeBackground: "#e4e7eb",
    defaultBackground: "#ffffff",
    inputBackground: "#ffffff",
    accent: "#c8c8fa",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },
  syntax: {
    keyword: "#d73a49",
    property: "#005cc5",
    plain: "#24292e",
    static: "#032f62",
    string: "#032f62",
    definition: "#6f42c1",
    punctuation: "#24292e",
    tag: "#22863a",
    comment: {
      color: "#6a737d",
      fontStyle: "normal",
    },
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

export const nightOwlTheme: SandpackTheme = {
  palette: {
    activeText: "rgb(197, 228, 253)",
    defaultText: "rgb(105, 136, 161)",
    inactiveText: "rgb(78, 82, 97)",
    activeBackground: "rgb(58, 62, 77)",
    defaultBackground: "rgb(1, 22, 39)",
    inputBackground: "rgb(11, 41, 66)",
    accent: "#7fdbca",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
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
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

export const monokaiProTheme: SandpackTheme = {
  palette: {
    activeText: "rgb(252, 252, 250)",
    defaultText: "rgb(147, 146, 147)",
    inactiveText: "#444344",
    activeBackground: "#444344",
    defaultBackground: "rgb(45, 42, 46)",
    inputBackground: "rgb(25, 24, 26)",
    accent: "rgb(255, 216, 102)",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
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
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};
