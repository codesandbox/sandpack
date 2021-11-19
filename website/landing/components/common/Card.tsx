import { styled } from "../../stitches.config";

export const Card = styled("div", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
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
});

export const CardTitle = styled("h4", {
  fontSize: "24px",
  fontWeight: "$semiBold",
  lineHeight: "1.2",
  letterSpacing: "-0.05em",
  margin: 0,

  "@bp1": {
    fontSize: "36px",
  },
});

export const CardDescription = styled("p", {
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

  "@bp1": {
    fontSize: "16px",
  },

  "@bp2": {
    fontSize: "18px",
    textAlign: "start",

    code: {
      alignItems: "center",
      background: "$primary",
      borderRadius: "145px",
      display: "inline-flex",
      padding: "2px 14px",
    },
  },
});
