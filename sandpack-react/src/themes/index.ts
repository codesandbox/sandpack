import type {
  SandpackTheme,
  SandpackPredefinedTheme,
  SandpackSyntaxStyle,
  SandpackThemeProp,
} from "../types";
import { getDarkModePreference } from "../utils/domUtils";
import { hexToCSSRGBa } from "../utils/stringUtils";

/**
 * @category Theme
 */
export const defaultLight: SandpackTheme = {
  palette: {
    activeText: "#1f2933",
    defaultText: "#757678",
    inactiveText: "#e4e7eb",
    activeBackground: "#e4e7eb",
    defaultBackground: "#f8f9fb",
    inputBackground: "#ffffff",
    accent: "#64D2FF",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
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
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

/**
 * @category Theme
 */
export const defaultDark: SandpackTheme = {
  palette: {
    activeText: "#FFFFFF",
    defaultText: "#999999",
    inactiveText: "#343434",
    activeBackground: "#343434",
    defaultBackground: "#040404",
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

/**
 * @category Theme
 */
export const SANDPACK_THEMES: Record<SandpackPredefinedTheme, SandpackTheme> = {
  light: defaultLight,
  dark: defaultDark,
};

/**
 * @category Theme
 */
export const createThemeObject = (
  inputTheme?: SandpackThemeProp
): { id: string; theme: SandpackTheme } => {
  const defaultLightTheme = defaultLight;
  const defaultLightThemeKey = "default";

  const defaultDarkTheme = defaultDark;
  const defaultDarkThemeKey = "default-dark";

  if (inputTheme === undefined) {
    return {
      theme: defaultLightTheme,
      id: defaultLightThemeKey,
    };
  }

  if (inputTheme === "auto") {
    return getDarkModePreference()
      ? {
          theme: defaultDarkTheme,
          id: defaultDarkThemeKey,
        }
      : {
          theme: defaultLightTheme,
          id: defaultLightThemeKey,
        };
  }

  if (typeof inputTheme === "string") {
    const predefinedTheme = SANDPACK_THEMES[inputTheme];
    if (!predefinedTheme) {
      throw new Error(`Invalid theme '${inputTheme}' provided.`);
    }

    return {
      theme: predefinedTheme,
      id: inputTheme ?? defaultLightThemeKey,
    };
  }

  const theme = {
    palette: { ...defaultLightTheme.palette, ...inputTheme?.palette },
    syntax: { ...defaultLightTheme.syntax, ...inputTheme?.syntax },
    typography: {
      ...defaultLightTheme.typography,
      ...inputTheme?.typography,
    },
  };

  const id = simpleHashFunction(JSON.stringify(theme));

  return {
    theme,
    id: `sp-${id}`,
  };
};

const simpleHashFunction = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; hash &= hash) {
    hash = 31 * hash + str.charCodeAt(i++);
  }
  return Math.abs(hash);
};

// inactive fg and active bg are interchangable to limit the number of colors in the theme
// bg-default-overlay is determined by adjusting the alpha channel on the default bg to 80%
/**
 * @category Theme
 */
export const getThemeStyleSheet = (
  theme: SandpackTheme,
  themeId: string
): string => `
.sp-wrapper.sp-${themeId} {
  --sp-colors-fg-active: ${theme.palette.activeText};
  --sp-colors-fg-default: ${theme.palette.defaultText};
  --sp-colors-fg-inactive: ${
    theme.palette.inactiveText || theme.palette.activeBackground
  };
  --sp-colors-bg-active: ${
    theme.palette.activeBackground || theme.palette.inactiveText
  };
  --sp-colors-bg-default: ${theme.palette.defaultBackground};
  --sp-colors-bg-default-overlay: ${hexToCSSRGBa(
    theme.palette.defaultBackground,
    0.8
  )};
  --sp-colors-bg-input: ${theme.palette.inputBackground};
  --sp-colors-accent: ${theme.palette.accent};
  --sp-colors-bg-error: ${theme.palette.errorBackground};
  --sp-colors-fg-error: ${theme.palette.errorForeground};
  --sp-font-size: ${theme.typography.fontSize};
  --sp-font-body: ${theme.typography.bodyFont};
  --sp-font-mono: ${theme.typography.monoFont};
  --sp-line-height: ${theme.typography.lineHeight};
`;

/**
 * @category Theme
 */
export const getSyntaxStyle = (
  token: string | SandpackSyntaxStyle
): SandpackSyntaxStyle => {
  if (typeof token === "string") {
    return { color: token };
  }

  return token;
};
