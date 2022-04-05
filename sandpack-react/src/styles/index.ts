import { createStitches } from "@stitches/core";

import { defaultLight, SANDPACK_THEMES } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";

/**
 * @category ThemeisDarkColor
 */
export const THEME_PREFIX = "sp";

/**
 * @category Theme
 */
export const { createTheme, css, getCssText, keyframes } = createStitches({
  prefix: THEME_PREFIX,
});

const defaultVariables = {
  space: new Array(11).fill(" ").reduce((acc, _, index) => {
    return { ...acc, [index + 1]: `${(index + 1) * 4}px` };
  }, {}),
  border: { radius: "4px" },
  layout: { height: "300px" },
  transitions: { default: "150ms ease" },
  zIndices: {
    base: "1",
    overlay: "2",
    top: "3",
  },
};

/**
 * @category Theme
 */
export const standardizeStitchesTheme = (
  theme: SandpackTheme
): Record<string, Record<string, string>> => {
  // Flat values
  const syntaxEntries = Object.entries(theme.syntax);
  const syntax = syntaxEntries.reduce((tokenAcc, [tokenName, tokenValue]) => {
    // Single property
    let newValues = { [`color-${tokenName}`]: tokenValue };

    // Multiples properties
    if (typeof tokenValue === "object") {
      newValues = Object.entries(tokenValue).reduce(
        (valueAcc, [styleProp, styleValue]) => {
          return {
            ...valueAcc,
            [`${styleProp}-${tokenName}`]: styleValue,
          };
        },
        {}
      );
    }

    return { ...tokenAcc, ...newValues };
  }, {});

  return {
    ...defaultVariables,
    colors: theme.colors,
    font: theme.font,
    syntax,
  };
};

/**
 * @category Theme
 */
export const standardizeTheme = (
  inputTheme?: SandpackThemeProp
): { id: string; theme: SandpackTheme } => {
  const defaultLightTheme = defaultLight;
  const defaultLightThemeKey = "default";

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
    colors: {
      ...defaultLightTheme.colors,
      ...(inputTheme?.colors ?? {}),
    },
    syntax: { ...defaultLightTheme.syntax, ...(inputTheme?.syntax ?? {}) },
    font: {
      ...defaultLightTheme.font,
      ...(inputTheme?.font ?? {}),
    },
  };

  const id = inputTheme
    ? simpleHashFunction(JSON.stringify(theme))
    : defaultLightThemeKey;

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
