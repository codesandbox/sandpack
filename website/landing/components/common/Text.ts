import { styled } from "../../stitches.config";

export const Text = styled("p", {
  fontFamily: "$base",
  margin: 0,

  code: {
    alignItems: "center",
    background: "$primary",
    borderRadius: "24px",
    color: "$lightTextPrimary",
    display: "inline-flex",
    fontWeight: "$normal",
    fontSize: "inherit",
    lineHeight: "inherit",
    letterSpacing: "inherit",
    padding: "4px 12px",
  },

  ".highlight": {
    color: "$primary",
  },
});
