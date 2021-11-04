type Font = "base" | "mono";
type FontRecord = Record<Font, string>;

export const font: FontRecord = {
  base: "Inter",
  mono: "FiraCode",
};

export const fontStack: FontRecord = {
  base: `${font.base}, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`,
  mono: `${font.mono}, 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
};
