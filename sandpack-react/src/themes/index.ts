import type { SandpackTheme, SandpackPredefinedTheme } from "../types";

/**
 * @category Theme
 */
export const defaultLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#EFEFEF",
    surface3: "#E1E3E5",

    disable: "#C5C5C5",
    base: "#323232",
    clickable: "#808080",
    hover: "#4D4D4D",
    accent: "#3973E0",

    error: "#EA3323",

    // activeText: "#1f2933",
    // defaultText: "#757678",
    // inactiveText: "#e4e7eb",
    // activeBackground: "#e4e7eb",
    // defaultBackground: "#f8f9fb",
    // inputBackground: "#ffffff",
    // accent: "#64D2FF",
    // errorBackground: "#ffcdca",
    // errorForeground: "#811e18",
  },
  syntax: {
    plain: "#151515",
    comment: { color: "#999", fontStyle: "italic" },
    keyword: "#0971F1",
    tag: "#0971F1",
    punctuation: "#151515",
    definition: "#151515",
    property: "#151515",
    static: "#FF453A",
    string: "#BF5AF2",
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "13px",
    lineHeight: "20px",
  },
};

/**
 * @category Theme
 */
export const defaultDark: SandpackTheme = {
  colors: {
    surface1: "#151515",
    surface2: "#252525",
    surface3: "#2F2F2F",

    disable: "#4D4D4D",
    base: "#808080",
    clickable: "#999999",
    hover: "#C5C5C5",
    accent: "#E5E5E5",

    error: "#EA3323",

    // activeText: "#FFFFFF",
    // defaultText: "#999999",
    // inactiveText: "#343434",
    // activeBackground: "#343434",
    // defaultBackground: "#040404",
    // inputBackground: "#242424",
    // accent: "#6caedd",
    // errorBackground: "#ffcdca",
    // errorForeground: "#811e18",
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
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    size: "14px",
    lineHeight: "1.4",
  },
};

/**
 * @category Theme
 */
export const SANDPACK_THEMES: Record<SandpackPredefinedTheme, SandpackTheme> = {
  light: defaultLight,
  dark: defaultDark,
};
