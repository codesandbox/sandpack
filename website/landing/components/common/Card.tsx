import { styled } from "../../stitches.config";

export const Card = styled("div", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "336px",

  "@bp1": {
    gap: "20px",
    width: "384px",
  },

  "@bp2": {
    alignItems: "flex-start",
    width: "360px",
  },

  "@bp3": {
    width: "480px",
  },

  variants: {
    size: {
      small: {
        gap: "10px",
        width: "256px",

        "@bp2": {
          width: "240px",
        },

        "@bp3": {
          width: "320px",
        },
      },
    },
  },
});

export const CardTitle = styled("h4", {
  color: "$$primaryTextColor",
  fontSize: "24px",
  fontWeight: "$semiBold",
  lineHeight: "1.2",
  letterSpacing: "-0.05em",
  margin: 0,
  textAlign: "center",

  "@bp1": {
    fontSize: "36px",
  },

  "@bp2": {
    textAlign: "left",
  },

  variants: {
    size: {
      small: {
        fontWeight: "$normal",
        fontSize: "24px",
      },
    },
  },
});

export const CardDescription = styled("p", {
  color: "$$secondaryTextColor",
  lineHeight: "1.4",
  letterSpacing: "-0.025em",
  fontSize: "16px",
  margin: 0,
  textAlign: "center",

  code: {
    fontFamily: "$mono",
    fontSize: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
  },

  ".external-link": {
    color: "$$codeBlockForeground",
    textDecoration: "underline",

    "&:hover": {
      textDecoration: "none",
    },
  },

  "@bp2": {
    fontSize: "18px",
    textAlign: "start",

    "a code:hover": {
      background: "$primary",
      color: "$darkBackground",
    },

    code: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 8px",
      borderRadius: "6px",
      fontFamily: "$mono",
      fontSize: "16px",
      lineHeight: 1.4,
      letterSpacing: "-0.025em",
      background: "$$codeBlockBackground",
      color: "$$codeBlockForeground",
      transition: "all .2s ease",
    },
  },

  variants: {
    size: {
      small: {
        letterSpacing: "-0.05em",
      },
    },
  },
});
