import {
  motion,
  useSpring,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

import { styled } from "../../stitches.config";
import content from "../../website.config.json";
import { Box, List } from "../common";

import { Illustration } from "./Illustration";

// SHARED SECTION START
const SectionWrapper = styled("div", {
  background: "$lightBackground",
  color: "$lightTextPrimary",
  display: "flex",
  height: "100%",
  justifyContent: "center",
  width: "100%",
});

const SectionContainer = styled("section", {
  overflow: "hidden",
  padding: "0 24px 100px",
  maxWidth: "2560px",
  width: "100%",

  "@bp2": {
    paddingBottom: 0,
  },
});

const SectionHeader = styled("header", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  padding: "200px 0 100px",
});

const SectionTitle = styled("h2", {
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
// SHARED SECTION END

// CARD SECTION START
const Card = styled("div", {
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

const CardTitle = styled("h4", {
  fontSize: "24px",
  fontWeight: "$semiBold",
  lineHeight: "1.2",
  letterSpacing: "-0.05em",
  margin: 0,

  "@bp1": {
    fontSize: "36px",
  },
});

const CardDescription = styled("p", {
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
// CARD SECTION END

interface HighlightWrapperProps {
  highlight: Record<string, string>;
}
const HighlightWrapper: React.FC<HighlightWrapperProps> = ({ highlight }) => {
  const { ref, inView } = useInView({ threshold: 0 });

  return (
    <Box
      as="li"
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        justifyContent: "center",
        width: "100%",

        "@bp2": {
          alignItems: "center",
          flexDirection: "row",
          gap: "240px",
          height: "100vh",
          maxHeight: "1080px",
          scrollSnapAlign: "center",
          width: "initial",

          "&:nth-of-type(even)": {
            flexDirection: "row-reverse",
          },
        },

        "@bp3": {
          gap: "320px",
        },
      }}
    >
      <Box ref={ref}>
        <Illustration
          illustrationKey={highlight.illustrationKey}
          visible={inView}
        />
      </Box>
      <Box>
        <Card>
          <CardTitle>{highlight.title}</CardTitle>
          <CardDescription
            dangerouslySetInnerHTML={{
              __html: highlight.description,
            }}
          />
        </Card>
      </Box>
    </Box>
  );
};

const SPRING_OPTIONS = { stiffness: 50, damping: 10 };

export const AdvancedUsage: React.FC = () => {
  const { api } = content;

  const section = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const { scrollY } = useViewportScroll();
  const leftRange = useTransform(
    scrollY,
    [sectionTop - windowHeight, sectionTop + windowHeight],
    [-50, 50]
  );
  const rightRange = useTransform(
    scrollY,
    [sectionTop - windowHeight, sectionTop + windowHeight],
    [50, -50]
  );
  const leftY = useSpring(leftRange, SPRING_OPTIONS);
  const rightY = useSpring(rightRange, SPRING_OPTIONS);

  useLayoutEffect(() => {
    const container = section.current;
    if (!container || !window) return;

    const onResize = () => {
      setSectionTop(container.offsetTop);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [section]);

  return (
    <SectionWrapper ref={section}>
      <SectionContainer>
        <SectionHeader
          css={{
            "@bp3": {
              gap: "40px",
            },
          }}
        >
          <Box
            style={{
              display: "flex",
              position: "relative",
              height: "calc(300px - 150px / 4)",
            }}
          >
            <motion.div
              style={{
                width: "82px",
                height: "150px",
                border: "13px solid #000",
                y: leftY,
              }}
            />
            <motion.div
              style={{
                width: "82px",
                height: "150px",
                border: "13px solid #000",
                x: "-13px",
                y: rightY,
              }}
            />
          </Box>
          <SectionTitle dangerouslySetInnerHTML={{ __html: api.title }} />
        </SectionHeader>
        <List
          as="ul"
          css={{
            display: "flex",
            flexWrap: "wrap",
            gap: "100px",

            "@bp1": {
              gap: "200px",
            },

            "@bp2": {
              alignItems: "center",
              flexDirection: "column",
              gap: "0",
              scrollSnapType: "y mandatory",
            },
          }}
        >
          {api.highlights.map((highlight, highlightIndex) => (
            <HighlightWrapper
              key={`api-highlight-${highlightIndex}`}
              highlight={highlight}
            />
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
