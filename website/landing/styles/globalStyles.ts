import { globalCss } from "../stitches.config";

import { baseFont, fontWeights, monoFont } from "./typography";

export const globalStyles = globalCss({
  "@font-face": [
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.normal,
      src: `url("assets/fonts/Inter-Regular.woff") format("woff")`,
    },
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.semiBold,
      src: `url("assets/fonts/Inter-SemiBold.woff") format("woff")`,
    },
    {
      fontFamily: monoFont,
      src: `url("assets/fonts/FiraCode-Regular.woff") format("woff")`,
    },
  ],

  "*, *::before, *::after": {
    boxSizing: "border-box",
  },

  body: {
    backgroundColor: "$darkBackground",
    color: "$darkTextPrimary",
    fontSize: "10px",
    fontFamily: "$base",
    margin: 0,
    overflowX: "hidden",
  },

  "a, a:visited": {
    color: "inherit",
    textDecoration: "none",
  },

  code: {
    fontFamily: "$mono",
  },
});
