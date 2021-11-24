import { useTransform, useViewportScroll } from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";

import { advancedUsage as content } from "../../website.config.json";
import {
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { ParallaxLogo } from "../common/ParallaxLogo";

import { UsageExample } from "./UsageExample";

export const AdvancedUsage: React.FC = () => {
  const section = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const { scrollY } = useViewportScroll();
  const leftRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
    [-20, 40]
  );
  const rightRange = useTransform(
    scrollY,
    [sectionTop - windowHeight / 2, sectionTop + windowHeight / 2],
    [20, -40]
  );

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
    <SectionWrapper ref={section} css={{ overflow: "hidden" }} theme="light">
      <SectionContainer>
        <SectionHeader
          css={{
            gap: "40px",
          }}
        >
          <ParallaxLogo leftRange={leftRange} rightRange={rightRange} />
          <SectionTitle dangerouslySetInnerHTML={{ __html: content.title }} />
        </SectionHeader>
        <List
          as="ul"
          css={{
            display: "flex",
            flexWrap: "wrap",
            gap: "100px",
            width: "100%",

            "@bp1": {
              gap: "200px",
            },

            "@bp2": {
              alignItems: "center",
              flexDirection: "column",
              gap: "0",
              scrollSnapType: "y mandatory",
              width: "initial",
            },
          }}
        >
          {content.examples.map((example, exampleIndex) => (
            <ListItem
              key={`usage-example-${exampleIndex}`}
              css={{ width: "100%", "@bp2": { width: "initial" } }}
            >
              <UsageExample example={example} exampleIndex={exampleIndex} />
            </ListItem>
          ))}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
