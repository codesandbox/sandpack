import { styled } from "../../stitches.config";

export const SectionWrapper = styled("div", {
  background: "$lightBackground",
  color: "$lightTextPrimary",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  width: "100%",
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
});
