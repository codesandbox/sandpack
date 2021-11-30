import {
  nightOwlTheme,
  monokaiProTheme,
  sandpackDark,
} from "@codesandbox/sandpack-react";

const fantasy = {
  palette: {
    activeText: "#69c6b1",
    defaultText: "#7D8982",
    inactiveText: "#1b211e",
    activeBackground: "#1b211e",
    defaultBackground: "#242c28",
    inputBackground: "#fcb900",
    accent: "#69c6b1",
    errorBackground: "#fcb900",
    errorForeground: "#9900ef",
  },
  syntax: {
    plain: "#69c6b1",
    keyword: "#a29e6b",
    commment: {
      color: "#bbb",
      fontStyle: "italic",
    },
    tag: "#d4d4d4",
    punctuation: "#dcdcdc",
    definition: "#529383",
    property: "#ffffff",
    static: "#b5caa5",
    string: "#cc967c",
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

const dracula = {
  palette: {
    activeText: "#f8f8f2",
    defaultText: "#6272a4",
    inactiveText: "#282a36",
    activeBackground: "#21222c",
    defaultBackground: "#282a36",
    inputBackground: "#f8f8f2",
    accent: "#f8f8f2",
    errorBackground: "#ff79c6",
    errorForeground: "#cb6da3",
  },
  syntax: {
    plain: "#f8f8f2",
    keyword: "#ff79c6",
    commment: "#6272a4",
    tag: "#8be9fd",
    punctuation: "#f8f8f2",
    definition: "#50fa7b",
    property: "#8be9fd",
    static: "#bd93f9",
    string: "#f1fa8c",
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

const cobalt = {
  palette: {
    activeText: "#0088ff",
    defaultText: "#858585",
    inactiveText: "#062f52",
    activeBackground: "#021529",
    defaultBackground: "#002240",
    inputBackground: "#002240",
    accent: "#0088ff",
    errorBackground: "#FF453A",
    errorForeground: "#ff453a",
  },
  syntax: {
    plain: "#3cc9b0",
    comment: {
      color: "#0088ff",
      fontStyle: "italic",
    },
    keyword: "#ff9d00",
    tag: "#d4d4d4",
    punctuation: "#d4d4d4",
    definition: "#26918c",
    property: "#9cdbfe",
    static: "#ce9278",
    string: "#ce9278",
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

const amy = {
  palette: {
    activeText: "#3cc9b0",
    defaultText: "#dcdcdc",
    inactiveText: "#360136",
    activeBackground: "#37021a",
    defaultBackground: "#200020",
    inputBackground: "#a080ff",
    accent: "#3cc9b0",
    errorBackground: "#37021a",
    errorForeground: "#37021a",
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
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

const base = {
  palette: {
    activeText: "#FF8A00",
    defaultText: "#FF8A00",
    inactiveText: "#FF8A00",
    activeBackground: "#FF8A00",
    defaultBackground: "#FF8A00",
    inputBackground: "#FF8A00",
    accent: "#FF8A00",
    errorBackground: "#FF8A00",
    errorForeground: "#FF8A00",
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
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

// Workaround nightOwlTheme theme
// TODO: Create a function to getColor
if (nightOwlTheme.syntax.keyword) {
  nightOwlTheme.syntax.keyword = nightOwlTheme.syntax.keyword.color;
}

export const themeGalery = [
  {
    label: "Night Owl",
    code: nightOwlTheme,
  },
  {
    label: "Monokai",
    code: monokaiProTheme,
  },
  {
    label: "Sandpack Dark",
    code: sandpackDark,
  },
  {
    label: "Fantasy",
    code: fantasy,
  },
  {
    label: "Dracula",
    code: dracula,
  },
  {
    label: "Cobalt",
    code: cobalt,
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
