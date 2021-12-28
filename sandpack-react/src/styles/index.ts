import { createStitches } from "@stitches/core";

import type { SandpackThemeProp, SandpackTheme, SandpackSyntaxStyle } from "..";
import { defaultLight, SANDPACK_THEMES } from "..";

export const THEME_PREFIX = "sp";

export const { createTheme, css, getCssText, keyframes } = createStitches({
  prefix: THEME_PREFIX,
});

export const defaultVariables = {
  space: new Array(8).fill(" ").reduce((acc, curr, index) => {
    return { ...acc, [index + 1]: `${(index + 1) * 4}px` };
  }, {}),
  border: { radius: "4px" },
  layout: { height: "300px" },
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
