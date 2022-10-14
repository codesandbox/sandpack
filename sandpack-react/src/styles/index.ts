import { createStitches } from "@stitches/core";

import { defaultLight, defaultDark, SANDPACK_THEMES } from "../themes";
import type { SandpackTheme, SandpackThemeProp } from "../types";
import { isDarkColor } from "../utils/stringUtils";

import { createStitchesMock } from "./stitches-mock";

/**
 * @category Theme
 */
export const THEME_PREFIX = "sp";

const getNodeProcess = (): false | string | undefined => {
  if (typeof process !== "undefined") {
    return process.env.SANDPACK_BARE_COMPONENTS;
  }

  return false;
};

/**
 * @category Theme
 */
export const { createTheme, css, getCssText, keyframes } = getNodeProcess()
  ? createStitchesMock
  : createStitches({
      prefix: THEME_PREFIX,
    });

const defaultVariables = {
  space: new Array(11).fill(" ").reduce((acc, _, index) => {
    return { ...acc, [index + 1]: `${(index + 1) * 4}px` };
  }, {}),
  border: { radius: "4px" },
  layout: { height: "300px", headerHeight: "40px" },
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
  inputTheme: SandpackThemeProp = "light"
): { id: string; theme: SandpackTheme; mode: "dark" | "light" } => {
  const defaultLightThemeKey = "default";

  /**
   * Set a local theme: dark or light
   */
  if (typeof inputTheme === "string") {
    const predefinedTheme = SANDPACK_THEMES[inputTheme];
    if (!predefinedTheme) {
      throw new Error(
        `[sandpack-react]: invalid theme '${inputTheme}' provided.`
      );
    }

    return {
      theme: predefinedTheme,
      id: inputTheme,
      mode: "light",
    };
  }

  /**
   * Fullfill the colors key, in case it's missing any key
   */
  const mode = isDarkColor(
    inputTheme?.colors?.surface1 ?? defaultLight.colors.surface1
  )
    ? "dark"
    : "light";

  /**
   * Figure out what's the properly default colors it should be
   * error, warning and success colors have different values between dark and light
   */
  const baseTheme = mode === "dark" ? defaultDark : defaultLight;
  const colorsByMode = { ...baseTheme.colors, ...(inputTheme?.colors ?? {}) };
  const syntaxByMode = { ...baseTheme.syntax, ...(inputTheme?.syntax ?? {}) };
  const fontByMode = { ...baseTheme.font, ...(inputTheme?.font ?? {}) };

  const theme = {
    colors: colorsByMode,
    syntax: syntaxByMode,
    font: fontByMode,
  };

  const id = inputTheme
    ? simpleHashFunction(JSON.stringify(theme))
    : defaultLightThemeKey;

  return {
    theme,
    id: `sp-${id}`,
    mode,
  };
};

const simpleHashFunction = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; hash &= hash) {
    hash = 31 * hash + str.charCodeAt(i++);
  }
  return Math.abs(hash);
};
