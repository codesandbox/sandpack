const customTheme = {
  palette: {
    activeText: "#FFFFFF",
    defaultText: "#999999",
    inactiveText: "#343434",
    activeBackground: "#343434",
    defaultBackground: "#1c1e21",
    inputBackground: "#242424",
    accent: "#6caedd",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },
  syntax: {
    plain: "#FFFFFF",
    comment: { color: "#757575", fontStyle: "italic" },
    keyword: "#77B7D7",
    tag: "#DFAB5C",
    punctuation: "#ffffff",
    definition: "#86D9CA",
    property: "#77B7D7",
    static: "#C64640",
    string: "#977CDC",
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

module.exports = customTheme;
