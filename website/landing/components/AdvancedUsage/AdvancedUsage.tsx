import { useSpring, useTransform, useViewportScroll } from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";

import config from "../../website.config.json";
import {
  List,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { ParallaxLogo } from "../common/ParallaxLogo";

import { UsageExample } from "./UsageExample";

const SPRING_OPTIONS = { stiffness: 50, damping: 10 };

export const AdvancedUsage: React.FC = () => {
  const content = config.advancedUsage;

  const section = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const { scrollY } = useViewportScroll();
  const leftRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
    [-50, 50]
  );
  const rightRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
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

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [section]);

  return (
    <SectionWrapper ref={section}>
      <SectionContainer>
        <SectionHeader
          css={{
            gap: "40px",
          }}
        >
          <ParallaxLogo leftY={leftY} rightY={rightY} />
          <SectionTitle dangerouslySetInnerHTML={{ __html: content.title }} />
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
          {content.examples.map((example, exampleIndex) => (
            <li key={`usage-example-${exampleIndex}`}>
              <UsageExample example={example} exampleIndex={exampleIndex} />
            </li>
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
