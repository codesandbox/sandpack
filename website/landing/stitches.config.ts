import { createStitches } from "@stitches/react";

import { breakpoints } from "./styles/breakpoints";

export const { styled, getCssText } = createStitches({
  media: breakpoints,
});
