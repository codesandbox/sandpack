/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { forwardRef } from "react";

import { styled } from "../../../stitches.config";
import { Box } from "../../common";
import { useBreakpoint } from "../../common/useBreakpoint";

export const THRESHOLD_VIEW = 0.5;

// eslint-disable-next-line react/display-name
export const Row = forwardRef<unknown, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <Box
        ref={ref as any}
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          justifyContent: "center",
          width: "100%",

          "@bp2": {
            alignItems: "center",
            gap: "240px",
            flexDirection: "row",
            height: "100vh",
            maxHeight: "1080px",
            scrollSnapAlign: "center",
            width: "initial",
          },

          "@bp3": {
            gap: "320px",
          },
        }}
      >
        {children}
      </Box>
    );
  }
);

export const Content = styled("div", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",

  "@bp1": {
    gap: "20px",
    width: "384px",
  },

  "@bp2": {
    alignItems: "flex-start",
    width: "30%",
  },
});

export const SandpackContainerPlaceholder = styled("div", {
  width: "300px",
  "@bp3": { width: "560px" },
});

export const SandpackContainerMobile = styled("div", {
  width: "100%",

  "@bp1": {
    width: "auto",
  },

  "@bp2": {
    display: "none",
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
  maxWidth: "100%",
  padding: 0,

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
  const sectionRef = useRef<HTMLLIElement>(null);
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
      sectionTop - sectionHeight / 2,
      sectionTop - sectionHeight / 4,
      sectionTop - sectionHeight / 6,
      sectionTop + sectionHeight / 6,
      sectionTop + sectionHeight / 4,
      sectionTop + sectionHeight / 2,
    ],
    [0, 1, 1, 1, 1, 0]
  );

  return (
    <motion.li ref={sectionRef} style={{ opacity, width: "100%" }}>
      {children}
    </motion.li>
  );
};

export const CodeWrapper = styled("div", {
  position: "relative",
  width: "100%",

  pre: { padding: 0 },

  ".sp-code-editor": {
    borderRadius: "16px",
    padding: "0 15px",
  },
});
