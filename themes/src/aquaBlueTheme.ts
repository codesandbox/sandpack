import type { SandpackTheme } from "./types";

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
