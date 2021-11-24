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

  variants: {
    screenReader: {
      true: {
        border: "0 !important",
        clipPath: "inset(50%) !important",
        "-webkit-clip-path": "inset(50%) !important",
        height: "1px !important",
        margin: "-1px !important",
        overflow: "hidden !important",
        padding: "0 !important",
        position: "absolute !important",
        width: "1px !important",
        whiteSpace: "nowrap !important",
      },
    },
  },
});
