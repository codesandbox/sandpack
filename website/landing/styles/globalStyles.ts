import firaCodeFontSrc from "../assets/fonts/FiraCode-Regular.woff";
import interFontSrc from "../assets/fonts/Inter-Regular.woff";
import interSemiBoldFontSrc from "../assets/fonts/Inter-SemiBold.woff";
import { globalCss } from "../stitches.config";

import { baseFont, fontWeights, monoFont } from "./typography";

export const globalStyles = globalCss({
  "@font-face": [
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.normal,
      src: `url("${interFontSrc}") format("woff")`,
    },
    {
      fontFamily: baseFont,
      fontWeight: fontWeights.semiBold,
      src: `url("${interSemiBoldFontSrc}") format("woff")`,
    },
    {
      fontFamily: monoFont,
      src: `url("${firaCodeFontSrc}") format("woff")`,
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
