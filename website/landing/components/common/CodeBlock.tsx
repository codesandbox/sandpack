import { styled } from "@stitches/react";

export const CodeBlock = styled("pre", {
  alignItems: "flex-start",
  display: "flex",
  border: "1px solid rgba(111, 236, 91, 0.2)", // sandpack green
  borderRadius: "16px",
  color: "$darkTextPrimary",
  fontFamily: "$mono",
  fontWeight: "$normal",
  fontSize: "16px",
  lineHeight: "1.4",
  letterSpacing: "-0.025em",
  margin: "0",
  overflow: "hidden",

  code: {
    display: "block",
    margin: "8px 16px",
  },

  "@bp2": {
    fontSize: "18px",
  },
});
