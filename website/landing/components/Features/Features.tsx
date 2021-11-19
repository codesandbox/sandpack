import type { MotionValue } from "framer-motion";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import { useMemo } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import config from "../../website.config.json";
import {
  Box,
  Card,
  CardDescription,
  CardTitle,
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";

import { ICONS } from "./icons";

interface FeatureFadeProps {
  index: number;
  parentTop: number;
  parentHeight: number;
  scrollY: MotionValue<number>;
}
const FeatureFade: React.FC<FeatureFadeProps> = ({
  children,
  index,
  parentTop,
  parentHeight,
  scrollY,
}) => {
  const opacityRange = [0, 1];
  const scrollRange = [
    parentTop - parentHeight / (2 * Math.pow(index + 1, 2)), // Stagger elements by their index.
    parentTop + parentHeight / (index === 0 ? 6 : 4), // The title (index === 0) should have opacity 1 sooner than the list elements.
  ];
  const opacity = useTransform(scrollY, scrollRange, opacityRange);

  return <motion.div style={{ opacity }}>{children}</motion.div>;
};

export const Features: React.FC = () => {
  const content = config.features;

  const { scrollY } = useViewportScroll();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

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

  const fadeProps = useMemo(
    () => ({ scrollY, parentTop: sectionTop, parentHeight: sectionHeight }),
    [scrollY, sectionTop, sectionHeight]
  );

  return (
    <SectionWrapper ref={sectionRef}>
      <SectionContainer
        css={{
          "@bp2": {
            maxWidth: "65%",
          },
        }}
      >
        <FeatureFade index={0} {...fadeProps}>
          <SectionHeader css={{ "@bp2": { alignItems: "flex-start" } }}>
            <SectionTitle
              css={{ "@bp2": { textAlign: "start" } }}
              dangerouslySetInnerHTML={{ __html: content.title }}
            />
          </SectionHeader>
        </FeatureFade>
        <List
          css={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: "48px",
            justifyContent: "center",
            transition: "opacity .5s cubic-bezier(0.770, 0.000, 0.175, 1.000)",

            "@bp1": {
              gap: "100px",
            },

            "@bp2": {
              alignItems: "flex-start",
              flexDirection: "row",
              margin: "100px 0 200px",
              justifyContent: "space-between",
            },
          }}
        >
          {content.highlights.map((highlight, highlightIndex) => {
            const icon = ICONS[highlight.iconKey as keyof typeof ICONS];

            return (
              <ListItem key={`content-highlight-${highlightIndex}`}>
                <FeatureFade index={highlightIndex + 1} {...fadeProps}>
                  <Card size="small">
                    <Box
                      css={{
                        alignItems: "center",
                        color: "$lightTextPrimary",
                        background: "$primary",
                        borderRadius: "100%",
                        display: "flex",
                        flexShrink: "0",
                        flexGrow: "0",
                        height: "78px",
                        justifyContent: "center",
                        marginBottom: "20px",
                        padding: "18px",
                        width: "78px",
                      }}
                    >
                      {icon}
                    </Box>
                    <CardTitle size="small">{highlight.title}</CardTitle>
                    <CardDescription size="small">
                      {highlight.description}
                    </CardDescription>
                  </Card>
                </FeatureFade>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
