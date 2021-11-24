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

  // Remove when we replace scrollbar styling in the sandpack library
  "::-webkit-scrollbar": {
    width: 10,
    height: 10,
  },

  "::-webkit-scrollbar-track": {
    backgroundColor: "#131313",
  },

  "::-webkit-scrollbar-corner": {
    backgroundColor: "transparent",
  },

  /* Handle */
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 9999,
  },

  /* Handle on hover */
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  "body::-webkit-scrollbar": {
    width: 12,
    height: 12,
  },

  "body::-webkit-scrollbar-track": {
    borderLeft: "1px solid rgba(255,255,255,0.1)",
  },

  html: {
    fontSize:
      "clamp(10px, calc((100vw * 2) / 1440 * 10), calc((100vw * 2) / 1920 * 10))",
  },

  body: {
    backgroundColor: "$darkBackground",
    color: "$darkTextPrimary",
    fontSize: "1.6rem",
    fontSmooth: "antialiased",
    "-webkit-font-smoothing": "antialiased",
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
