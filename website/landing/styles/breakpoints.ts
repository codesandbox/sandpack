export type Breakpoint = "sm" | "md" | "lg" | "xg";

export const breakpointSizes: Record<Breakpoint, number> = {
  sm: 375,
  md: 768,
  lg: 1440,
  xg: 1920,
};

export const breakpoints: Record<Breakpoint, string> = {
  sm: `(max-width: ${breakpointSizes.sm}px)`,
  md: `(min-width: ${breakpointSizes.sm + 1}px) and (max-width: ${breakpointSizes.md}px)`,
  lg: `(min-width: ${breakpointSizes.md + 1}px) and (max-width: ${breakpointSizes.lg}px)`,
  xg: `(min-width: ${breakpointSizes.xg}px)`,
};
