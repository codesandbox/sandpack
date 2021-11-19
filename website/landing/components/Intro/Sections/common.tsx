import { forwardRef } from "react";
import { styled } from "../../../stitches.config";
import { Box, Text } from "../../common";

export const Wrapper = forwardRef<unknown, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <Box
        ref={ref}
        as="li"
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "48px",

          "@bp2": {
            alignItems: "center",
            justifyContent: "center",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            height: "100%",
            minHeight: "50vh",
          },
        }}
      >
        {children}
      </Box>
    );
  }
);

export const Container: React.FC = ({ children }) => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        margin: "0 auto",
        width: "344px",

        "@bp1": {
          width: "376px",
        },

        "@bp2": {
          width: "360px",
        },

        "@bp3": {
          width: "480px",
        },
      }}
    >
      {children}
    </Box>
  );
};

export const Title: React.FC = ({ children }) => {
  return (
    <Text
      css={{
        fontSize: "24px",
        fontWeight: "$semiBold",
        letterSpacing: "-0.05em",
        lineHeight: "1.2",
        textAlign: "center",

        "@bp1": {
          fontSize: "36px",
        },

        "@bp2": {
          textAlign: "start",
        },
      }}
    >
      {children}
    </Text>
  );
};

export const Description: React.FC = ({ children }) => {
  return (
    <Text
      css={{
        color: "$darkTextSecondary",
        fontSize: "16px",
        lineHeight: "1.4",
        letterSpacing: "-0.025em",
        textAlign: "center",

        "@bp2": {
          fontSize: "18px",
          textAlign: "start",
        },
      }}
    >
      {children}
    </Text>
  );
};

export const SeeMoreLink = styled("a", {
  fontSize: "18px",
  span: {
    color: "$primary",
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "none",
    },
  },
});
