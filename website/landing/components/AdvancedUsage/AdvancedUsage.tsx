import { useSpring, useTransform, useViewportScroll } from "framer-motion";
import React, { useLayoutEffect, useRef, useState } from "react";

// import config from "../../website.config.json";
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

const SPRING_OPTIONS = { stiffness: 200, damping: 20 };

export const AdvancedUsage: React.FC = () => {
  // TODO: investigate why the app isn't able to find the existing
  // content from the website config.
  const content = {
    title: "Building blocks<br />of the Sandpack<br />ecosystem.",
    examples: [
      {
        title: "Providers",
        description:
          "We export a <code>SandpackProvider</code> that manages the state and actions for sandpack and a <code>ThemeProvider</code> that handles the theme and style.",
        illustrationKey: "providers",
      },
      {
        title: "Components",
        description:
          "We also export the smaller parts that make up the <code>&lt;Sandpack /&gt;</code> component, so you can combine them with your custom components.",
        illustrationKey: "components",
      },
      {
        title: "Client",
        description:
          "The bundler is wrapped by a small package called <code>sandpack-client</code>, which is framework agnostic and allows you to tap into the bundler protocol.",
        illustrationKey: "client",
      },
    ],
  };

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
    <SectionWrapper ref={section} theme="light">
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
