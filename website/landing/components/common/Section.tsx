import { styled } from "../../stitches.config";
import { palette } from "../../styles/palette";

export const SectionWrapper = styled("div", {
  // TODO: investigate if it's possible to set
  // values defined from the theme and provided
  // by stitches rather than "hardcoding" them
  $$backgroundColor: palette.darkBackground,
  $$primaryTextColor: palette.darkTextPrimary,
  $$secondaryTextColor: palette.darkTextSecondary,

  background: "$$backgroundColor",
  color: "$$primaryTextColor",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  width: "100%",

  variants: {
    theme: {
      light: {
        $$backgroundColor: palette.lightBackground,
        $$primaryTextColor: palette.lightTextPrimary,
        $$secondaryTextColor: palette.lightTextSecondary,
      },
    },
  },
});

export const SectionContainer = styled("section", {
  overflow: "hidden",
  padding: "0 24px 100px",
  maxWidth: "2560px",
  width: "100%",

  "@bp2": {
    paddingBottom: 0,
  },
});

export const SectionHeader = styled("header", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  padding: "200px 0 100px",

  variants: {
    size: {
      small: {
        padding: "100px 0",

        "@bp1": {
          padding: "200px 0 100px",
        },
      },
    },
  },
});

export const SectionTitle = styled("h2", {
  fontSize: "36px",
  fontWeight: "$semiBold",
  letterSpacing: "-0.05em",
  lineHeight: "1",
  margin: 0,
  textAlign: "center",

  "@bp1": {
    fontSize: "72px",
  },

  "@bp2": {
    fontSize: "96px",
  },

  "@bp3": {
    fontSize: "144px",
  },

  variants: {
    size: {
      small: {
        fontSize: "18px",
        lineHeight: "1.2",
        letterSpacing: "-0.0125em",
      },
    },
  },
});
