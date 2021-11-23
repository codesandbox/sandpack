/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { forwardRef } from "react";

import { styled } from "../../../stitches.config";
import { Box, Text } from "../../common";
import { useBreakpoint } from "../../common/useBreakpoint";

// eslint-disable-next-line react/display-name
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
          gap: "24px",

          "@bp2": {
            gap: "48px",
            alignItems: "center",
            justifyContent: "center",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            height: "100%",
            minHeight: "100vh",
          },
        }}
      >
        {children}
      </Box>
    );
  }
);

export const SandpackContainerPlaceholder = styled("div", { width: "50vw" });

export const SandpackContainerMobile = styled("div", {
  "@bp2": {
    display: "none",
  },
});

export const Container: React.FC = ({ children }) => {
  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        margin: "0 auto",
        width: "calc(100vw - 32px)",
        maxWidth: "600px",

        "@bp1": {
          width: "40vw",
        },

        "@bp2": {
          width: "30vw",
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

        maxWidth: "440px",

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
        maxWidth: "440px",

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
  fontWeight: "$normal",
  fontSize: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  padding: "4px 12px",
  display: "inline-block",
});

export const SnippetButton = styled("button", {
  background: "none",
  border: "none",

  ".sp-wrapper": {
    cursor: "pointer",
    userSelect: "none",
  },
});

export const RefreshButton = styled("button", {
  background: "rgba(136, 136, 136, 0.2)",
  border: "none",
  color: "rgba(255,255,255, .5)",
  borderRadius: "100%",
  width: "24px",
  height: "24px",
  display: "flex",
  padding: 0,
  cursor: "pointer",

  position: "absolute",
  bottom: "12px",
  right: "10px",

  transition: ".2s ease all",

  "&:hover": {
    color: "rgba(255,255,255, 1)",
  },

  svg: {
    padding: "1px",
    margin: "auto",
  },
});

export const FadeAnimation: React.FC = ({ children }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  const isDesktop = useBreakpoint("bp2");

  useLayoutEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const onResize = () => {
      setSectionTop(sectionEl.offsetTop);
      setSectionHeight(sectionEl.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sectionRef]);

  const { scrollY } = useViewportScroll();
  const opacity = useTransform(
    scrollY,
    [
      sectionTop - sectionHeight / 4,
      sectionTop - sectionHeight / 6,
      sectionTop + sectionHeight / 6,
      sectionTop + sectionHeight / 4,
    ],
    [0, 1, 1, 0]
  );

  return (
    <motion.div ref={sectionRef} style={{ opacity: isDesktop ? opacity : 1 }}>
      {children}
    </motion.div>
  );
};
