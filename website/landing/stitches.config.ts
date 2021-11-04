import { createStitches } from "@stitches/react";

import { breakpoints } from "./styles/breakpoints";
import { palette } from "./styles/palette";
import { space } from "./styles/space";
import {
  fontSizes,
  letterSpacings,
  lineHeights,
  fontWeights,
  fonts,
} from "./styles/typography";

const sizes = space;

export const { globalCss, styled, getCssText } = createStitches({
  media: breakpoints,
  theme: {
    borderStyles: {},
    borderWidths: {},
    colors: {
      ...palette,
    },
    fontSizes,
    fontWeights,
    fonts,
    letterSpacings,
    lineHeights,
    radii: {
      1: "2px",
      2: "4px",
      3: "8px",
    },
    shadows: {
      1: `0px ${space[2]} ${space[1]} rgba(0, 0, 0, 0.12), 0px ${space[2]} ${space[4]} rgba(0, 0, 0, 0.24)`,
      2: `0px ${space[1]} ${space[1]} rgba(0, 0, 0, 0.12), 0px ${space[4]} ${space[8]} rgba(0, 0, 0, 0.24)`,
    },
    sizes,
    space,
    transitions: {
      transforms: `transform 200ms cubic-bezier(0.2, 1, 0.2, 1)`,
      colors: `200ms ease-in-out`,
      all: `$transforms, all $colors`,
    },
    zIndices: {},
  },
});
