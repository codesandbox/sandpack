import { motion, useTransform, useViewportScroll } from "framer-motion";
import Image from "next/image";
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
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

const AnimatedListItem = styled(motion.a, {});

const HighlightPreview: React.FC<{ source: string; alt: string }> = ({
  source,
  alt,
}) => {
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
        width: "100%",

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
      <Image alt={alt} height={720} src={source} width={480} />
    </Box>
  );
};

export const Showcase: React.FC = () => {
  const shouldAnimate = useBreakpoint("bp2");

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
            "@bp2": { padding: "200px 0" },
          }}
        >
          <SectionTitle dangerouslySetInnerHTML={{ __html: showCase.title }} />
        </SectionHeader>
        <Box css={{ "@bp2": { marginBottom: "200px", marginTop: "200px" } }}>
          <List
            css={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: "148px",

              "@bp2": {
                display: "grid",
                "--gap": "200px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              },
            }}
          >
            {showCase.highlights.map((item, hIndex) => (
              <AnimatedListItem
                key={`section-showcase-${hIndex}`}
                css={{
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
                href={item.url}
                style={{
                  translateY:
                    hIndex % 2 === 0 && shouldAnimate
                      ? leftColumnTranslateY
                      : "0",
                }}
                target="_blank"
              >
                <Box
                  css={{
                    gap: "40px",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <HighlightPreview
                    alt={item.title}
                    source={item.imageSource}
                  />
                  <Card css={{ alignItems: "center" }}>
                    <CardTitle
                      css={{ "@bp2": { textAlign: "center" } }}
                      dangerouslySetInnerHTML={{
                        __html: item.title,
                      }}
                    />
                    <CardDescription
                      css={{ textAlign: "center" }}
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </Card>
                </Box>
              </AnimatedListItem>
            ))}
          </List>
        </Box>
      </SectionContainer>
    </SectionWrapper>
  );
};
