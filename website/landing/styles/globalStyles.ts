import { globalCss } from "../stitches.config";

import { baseFont, fontWeights, monoFont } from "./typography";

export const globalStyles = globalCss({
  "@font-face": [
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.normal,
      src: `url("assets/fonts/Inter-Regular.woff") format("woff")`,
      fontDisplay: "swap",
    },
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.semiBold,
      src: `url("assets/fonts/Inter-SemiBold.woff") format("woff")`,
      fontDisplay: "swap",
    },
    {
      fontFamily: monoFont,
      src: `url("assets/fonts/FiraCode-Regular.woff") format("woff")`,
      fontDisplay: "swap",
    },
  ],

  "*, *::before, *::after": {
    boxSizing: "border-box",
    fontSmooth: "antialiased",
    "-webkit-font-smoothing": "antialiased",
  },

  "html, body": {
    backgroundColor: "$darkBackground",
    color: "$darkTextPrimary",
    height: "100%",
  },

  html: {
    fontSize: "10px",
  },

  body: {
    fontSize: "1.6rem",
    lineHeight: 1.6,
    letterSpacing: "-0.025em",
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
