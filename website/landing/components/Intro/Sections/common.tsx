import { forwardRef } from "react";
import { styled } from "../../../stitches.config";
import { Box, Text } from "../../common";
import { motion } from "framer-motion";

export const Wrapper = forwardRef<unknown, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <Box
        ref={ref as any}
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
            minHeight: "70vh",
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

export const getRelativeCoordinates = (event: any, referenceElement: any) => {
  const position = {
    x: event.pageX,
    y: event.pageY,
  };

  const offset = {
    left: referenceElement.offsetLeft,
    top: referenceElement.offsetTop,
  };

  let reference = referenceElement.offsetParent;

  while (reference) {
    offset.left += reference.offsetLeft;
    offset.top += reference.offsetTop;
    reference = reference.offsetParent;
  }

  return {
    x: position.x - offset.left + 15,
    y: position.y - offset.top - 35,
  };
};

export const ToolTip = styled(motion.div, {
  alignItems: "center",
  background: "$primary",
  borderRadius: "24px",
  color: "$lightTextPrimary",
  display: "inline-block",
  fontWeight: "$normal",
  fontSize: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  padding: "4px 12px",
});

export const SnippetButton = styled("button", {
  background: "none",
  border: "none",

  ".sp-wrapper": {
    cursor: "pointer",
    userSelect: "none",
  },
});
