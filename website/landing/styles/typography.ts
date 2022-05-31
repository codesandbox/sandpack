type FontType = "base" | "mono";
type FontWeight = "normal" | "semiBold";

export const baseFont = "Inter";
export const monoFont = "FiraCode";

export const normal = 400;
export const semiBold = 600;

export const fontFamilies: Record<FontType, string> = {
  base: `${baseFont}, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`,
  mono: `${monoFont}, 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
};

export const fontWeights: Record<FontWeight, number> = {
  normal,
  semiBold,
};

export const fontSizes = [16, 18, 24, 36, 72, 96, 144];

export const lineHeights = [1, 1.2, 1.4];

export const letterSpacings = [-0.05, -0.025, -0.0125];
