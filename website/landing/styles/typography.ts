import { fontStack } from "./fonts";
import { toPx, toEm } from "./utils";

export const typographyScale = {
  1: 10,
  2: 12,
  3: 13,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
};

const semanticScale = {
  base: typographyScale[3],
  caption1: typographyScale[2],
  caption2: typographyScale[1],
  heading1: typographyScale[7],
  heading2: typographyScale[6],
  heading3: typographyScale[5],
  mono: typographyScale[4],
  subheading1: typographyScale[4],
  subheading2: typographyScale[3],
};

type SemanticTypographyKey = keyof typeof semanticScale;

export const fontSizes: Record<SemanticTypographyKey, string> = {
  base: toPx(semanticScale.base),
  caption1: toPx(semanticScale.caption1),
  caption2: toPx(semanticScale.caption2),
  heading1: toPx(semanticScale.heading1),
  heading2: toPx(semanticScale.heading2),
  heading3: toPx(semanticScale.heading3),
  mono: toPx(semanticScale.mono),
  subheading1: toPx(semanticScale.subheading1),
  subheading2: toPx(semanticScale.subheading2),
};

const grid = 8; // 8px grid system

// Round up to the nearest multiple of our grid system
const toBaseLineHeight = (fontSizePx: number): string =>
  toPx(Math.ceil((fontSizePx * 1.3) / grid) * grid);

export const lineHeights: Record<SemanticTypographyKey, string> = {
  caption2: toBaseLineHeight(semanticScale.caption2),
  caption1: toBaseLineHeight(semanticScale.caption1),
  base: toBaseLineHeight(semanticScale.base),
  subheading2: toBaseLineHeight(semanticScale.subheading2),
  subheading1: toBaseLineHeight(semanticScale.subheading1),
  heading3: toBaseLineHeight(semanticScale.heading3),
  heading2: toBaseLineHeight(semanticScale.heading2),
  heading1: toBaseLineHeight(semanticScale.heading1),
  mono: toPx(semanticScale.mono * 1.3),
};

// Values are taken from https://rsms.me/inter/dynmetrics/
export const letterSpacings: Record<SemanticTypographyKey, string> = {
  heading1: toEm(-0.021),
  heading2: toEm(-0.019),
  heading3: toEm(-0.017),
  subheading1: toEm(-0.011),
  subheading2: toEm(-0.006),
  base: toEm(-0.0025),
  caption1: toEm(0),
  caption2: toEm(0.01),
  mono: toEm(0),
};

export const fontWeights: Record<SemanticTypographyKey, string> = {
  heading1: "400",
  heading2: "400",
  heading3: "400",
  subheading1: "400",
  subheading2: "600",
  base: "400",
  caption1: "400",
  caption2: "600",
  mono: "400",
};

export const fonts: Record<SemanticTypographyKey, string> = {
  heading1: fontStack.base,
  heading2: fontStack.base,
  heading3: fontStack.base,
  subheading1: fontStack.base,
  subheading2: fontStack.base,
  base: fontStack.base,
  caption1: fontStack.base,
  caption2: fontStack.base,
  mono: fontStack.mono,
};
