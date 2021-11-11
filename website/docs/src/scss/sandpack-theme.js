const customTheme = {
  palette: {
    activeText: "#90e86f",
    defaultText: "#5a5a5a",
    inactiveText: "#1a1a1a",
    activeBackground: "#272727",
    defaultBackground: "#131313",
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

module.exports = customTheme;
