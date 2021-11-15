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
