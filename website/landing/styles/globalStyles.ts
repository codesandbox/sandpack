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
  },

  "a, a:visited": {
    color: "inherit",
    textDecoration: "none",
  },

  code: {
    fontFamily: "$mono",
  },

  /* Sandpack theme SSR overrides */
  ".sp-wrapper": {
    "--sp-border-radius": "10px !important",
    "--sp-colors-fg-active": "#90e86f !important",
    "--sp-colors-fg-default": "#5a5a5a !important",
    "--sp-colors-fg-inactive": "#1a1a1a !important",
    "--sp-colors-bg-active": "#272727 !important",
    "--sp-colors-bg-default": "#131313 !important",
    "--sp-colors-bg-input": "#2e2e2e !important",
    "--sp-colors-accent": "#90e86f !important",
    "--sp-colors-bg-error": "#dac1fb !important",
    "--sp-colors-fg-error": "#b08df8 !important",
  },

  ".sp-wrapper .sp-layout": {
    border: 0,
  },

  ".sp-pre-placeholder": {
    "--sp-colors-fg-active": "#f0fdaf",
    display: "block",
  },
});
