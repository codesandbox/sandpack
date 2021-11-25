import {
  ClasserProvider,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import {
  AnimateSharedLayout,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import debounce from "lodash.debounce";
import { useLayoutEffect, useRef, useState } from "react";

import { Box, SectionContainer, SectionWrapper } from "../../common";

import { AnimatedPreview } from "./AnimatedPreview";
import { HeroEditor } from "./HeroEditor";
import { HeroMain } from "./HeroMain";
import { files } from "./heroSandpackFiles";
import { StaticPreview } from "./StaticPreview";

const CUSTOM_CLASSES_MAP = {
  "sp-stack": "custom-stack__hero",
  "sp-wrapper": "custom-wrapper__hero",
};

const SandpackWrapper: React.FC = ({ children }) => {
  return (
    <SandpackProvider
      customSetup={{
        files,
        dependencies: { "@stitches/react": "latest" },
      }}
      initMode="user-visible"
      template="react"
    >
      <SandpackThemeProvider theme="sandpack-dark">
        <ClasserProvider classes={CUSTOM_CLASSES_MAP}>
          {children}
        </ClasserProvider>
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};

const Section: React.FC = ({ children }) => {
  return (
    <SectionWrapper css={{ overflow: "hidden" }}>
      <SectionContainer
        css={{
          margin: 0,
          overflow: "hidden",
          padding: 0,
          position: "relative",
        }}
      >
        {children}
      </SectionContainer>
    </SectionWrapper>
  );
};

export const HeroDesktop: React.FC = () => {
  // Hero dimensions
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroTop, setHeroTop] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const [heroScroll, setHeroScroll] = useState(0);

  // Animation tracker
  const [animationComplete, setAnimationComplete] = useState(false);

  // Scroll animations start
  const { scrollY } = useViewportScroll();

  // Scroll range for the container animation is from heroTop to 75%
  // of the hero's height
  const containerScrollInput = [heroTop, heroTop + heroScroll * 0.75];

  // Translate hero out of view when scrolling past it
  const heroTranslateY = useTransform(
    scrollY,
    [heroTop + heroScroll, heroHeight + (heroHeight - heroScroll)], // heroHeight - heroScroll = window height: ;
    ["0%", "-100%"]
  );

  // Get dimensions
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onResize = debounce(() => {
      // The top allows to define when the animation should start
      // based on the scroll position.
      const updatedTop = hero.offsetTop;
      if (updatedTop !== heroTop) {
        setHeroTop(updatedTop);
      }

      // The scroll (hero height - window height), when combined
      // with the top value, defines the animation scroll range
      const updatedHeight = hero.offsetHeight;
      if (updatedHeight !== heroHeight) {
        setHeroHeight(updatedHeight);
      }

      const updatedScroll = updatedHeight - window.innerHeight;
      if (updatedScroll !== heroScroll) {
        setHeroScroll(updatedScroll);
      }
    }, 300);

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [heroHeight, heroRef, heroScroll, heroTop]);

  // Scroll listener
  useLayoutEffect(() => {
    const onScroll = debounce(() => {
      const hasCompleted = window.scrollY >= heroScroll * 0.75; // Arbitraty number
      if (hasCompleted !== animationComplete) {
        setAnimationComplete(hasCompleted);
      }
    }, 0);

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [animationComplete, heroScroll]);

  return (
    <>
      <SandpackWrapper>
        <Section>
          <AnimateSharedLayout>
            <HeroMain translateY={heroTranslateY}>
              <HeroEditor
                animationComplete={animationComplete}
                containerScrollInput={containerScrollInput}
                scrollY={scrollY}
              />

              {/* Preview */}
              <Box
                css={{
                  background: "$surface",
                  fontSize: "1.6rem" /* TODO: responsive font-sizes (?) */,
                  lineHeight: 1.6,
                  letterSpacing: "-0.025em",
                  height: "100%",
                  position: "relative",
                  width: "100vw",
                  maxWidth: "2560px",
                }}
              >
                <AnimatedPreview heroScroll={heroScroll} heroTop={heroTop} />
                <StaticPreview animationComplete={animationComplete} />
              </Box>
            </HeroMain>
            {/* This ghost ref sets the hero dimensions  */}
            <Box
              ref={heroRef}
              style={{
                height: "150vw",
                maxHeight: "2560px",
                width: "100vw",
                maxWidth: "2560px",
              }}
            />{" "}
          </AnimateSharedLayout>
        </Section>
      </SandpackWrapper>
    </>
  );
};
