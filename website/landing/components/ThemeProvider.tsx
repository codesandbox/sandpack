import React from "react";

import firaCodeFontSrc from "../assets/fonts/FiraCode-Regular.woff";
import interFontSrc from "../assets/fonts/Inter-Regular.woff";
import interSemiBoldFontSrc from "../assets/fonts/Inter-SemiBold.woff";
import { globalCss } from "../stitches.config";
import { font } from "../styles/fonts";

const globalStyles = globalCss({
  "@font-face": [
    {
      fontFamily: font.base,
      fontWeight: "400",
      src: `url("${interFontSrc}") format("woff")`,
    },
    {
      fontFamily: font.base,
      fontWeight: "600",
      src: `url("${interSemiBoldFontSrc}") format("woff")`,
    },
    {
      fontFamily: font.mono,
      src: `url("${firaCodeFontSrc}") format("woff")`,
    },
  ],

  "*, *:after, *:before": {
    boxSizing: "border-box",
  },

  body: {
    fontFamily: "$base",
    fontSize: "$base",

    backgroundColor: "$grayDark",
    color: "$white",

    margin: "0",
  },
});

export const ThemeProvider: React.FC = ({ children }) => {
  globalStyles();

  return <>{children}</>;
};
