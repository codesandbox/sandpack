import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { styled } from "../../stitches.config";
import content from "../../website.config.json";
import {
  Box,
  List,
  SectionWrapper,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  Card,
  CardTitle,
  CardDescription,
  Text,
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

const AnimatedListItem = styled(motion.li, {});

const HighlightPreview = () => {
  return (
    <Box
      css={{
        alignItems: "center",
        background: "$surface",
        color: "white",
        display: "flex",
        height: "595px",
        justifyContent: "center",
        margin: "0 auto",
        width: "343px",

        "@bp1": {
          width: "384px",
        },

        "@bp2": {
          height: "540px",
          width: "360px",
        },

        "@bp3": {
          height: "720px",
          width: "480px",
        },
      }}
    >
      <Text>content landmark.</Text>
    </Box>
  );
};

export const Showcase: React.FC = () => {
  const shouldAnimate = useBreakpoint("bp1");

  const { showCase } = content;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionScroll, setSectionScroll] = useState(0);

  const { scrollY } = useViewportScroll();
  const scrollInput = [sectionTop, sectionTop + sectionScroll];
  const translateOutput = ["-25%", "25%"];
  const leftColumnTranslateY = useTransform(
    scrollY,
    scrollInput,
    translateOutput
  );

  useLayoutEffect(() => {
    const container = sectionRef.current;
    if (!container || !window) return;

    const onResize = () => {
      setSectionTop(container.offsetTop);
      setSectionScroll(container.offsetHeight - window.innerHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sectionRef]);

  return (
    <SectionWrapper ref={sectionRef}>
      <SectionContainer>
        <SectionHeader
          css={{
            "@bp2": {
              padding: "200px 0",
            },
          }}
        >
          <SectionTitle dangerouslySetInnerHTML={{ __html: showCase.title }} />
        </SectionHeader>
        <List
          css={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "148px",
            width: "100%",

            "@bp2": {
              display: "grid",
              gap: "200px",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              marginBottom: "200px",
            },
          }}
        >
          {showCase.highlights.map((h, hIndex) => (
            <AnimatedListItem
              key={`section-showcase-${hIndex}`}
              css={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "40px",

                "@bp1": {
                  width: "384px",
                },

                "@bp2": {
                  marginTop: "25%",
                  position: "relative",
                  width: "360px",

                  "&:nth-of-type(odd)": {
                    transform: "translateY(0)",
                    justifySelf: "flex-end",
                  },

                  "&:nth-of-type(even)": {
                    justifySelf: "flex-start",
                    transform: "translateY(-25%)",
                  },
                },

                "@bp3": {
                  width: "480px",
                },
              }}
              style={{
                translateY: hIndex % 2 === 0 && shouldAnimate ? leftColumnTranslateY : "0",
              }}
            >
              <HighlightPreview />
              <Card css={{ alignItems: "center" }}>
                <CardTitle
                  dangerouslySetInnerHTML={{
                    __html: h.title,
                  }}
                />
                <CardDescription
                  css={{ textAlign: "center" }}
                  dangerouslySetInnerHTML={{
                    __html: h.description,
                  }}
                />
              </Card>
            </AnimatedListItem>
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
