import type { SandpackTheme, SandpackPredefinedTheme } from "../types";

/**
 * @category Theme
 */
export const defaultLight: SandpackTheme = {
  colors: {
    surface1: "#ffffff",
    surface2: "#EFEFEF",
    surface3: "#F3F3F3",

    disabled: "#C5C5C5",
    base: "#323232",
    clickable: "#808080",
    hover: "#4D4D4D",
    accent: "#3973E0",

    error: "#EA3323",
    errorSurface: "#FCF1F0",
    warning: "#6A4516",
    warningSurface: "#FEF2C0",
  },
  syntax: {
    plain: "#151515",
    comment: { color: "#999", fontStyle: "italic" },
    keyword: "#7C5AE3",
    tag: "#0971F1",
    punctuation: "#3B3B3B",
    definition: "#85A600",
    property: "#3B3B3B",
    static: "#3B3B3B",
    string: "#2E6BD0",
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

    disabled: "#4D4D4D",
    base: "#808080",
    clickable: "#999999",
    hover: "#C5C5C5",
    accent: "#E5E5E5",

    error: "#FFB4A6",
    errorSurface: "#690000",
    warning: "#E7C400",
    warningSurface: "#3A3000",
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
    size: "13px",
    lineHeight: "20px",
  },
};

/**
 * @category Theme
 */
export const SANDPACK_THEMES: Record<SandpackPredefinedTheme, SandpackTheme> = {
  light: defaultLight,
  dark: defaultDark,
  auto:
    typeof window !== "undefined"
      ? window?.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? defaultDark
        : defaultLight
      : defaultLight,
};
