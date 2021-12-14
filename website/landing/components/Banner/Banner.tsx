import { useTransform, useViewportScroll } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import content from "../../website.config.json";
import {
  Resources,
  SectionContainer,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { Clipboard } from "../common";
import { ParallaxLogo } from "../common/ParallaxLogo";
import { useBreakpoint } from "../common/useBreakpoint";

export const Banner: React.FC = () => {
  const { banner } = content;
  const shouldAnimate = useBreakpoint("bp2");

  const section = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);

  const { scrollY } = useViewportScroll();

  const leftRange = useTransform(
    scrollY,
    [sectionTop - sectionHeight / 2, sectionTop + sectionHeight / 2],
    shouldAnimate ? [-20, 40] : [-20, -20]
  );
  const rightRange = useTransform(
    scrollY,
    [sectionTop - sectionHeight / 2, sectionTop + sectionHeight / 2],
    shouldAnimate ? [40, -20] : [20, 20]
  );

  useLayoutEffect(() => {
    const container = section.current;
    if (!container || !window) return;

    const onResize = (): void => {
      setSectionTop(container.offsetTop);
      setSectionHeight(container.offsetHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [section]);

  return (
    <SectionWrapper ref={section}>
      <SectionContainer
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          overflow: "visible",

          "@bp3": {
            "--gap": "100px",
          },
        }}
      >
        <ParallaxLogo leftRange={leftRange} rightRange={rightRange} />
        <SectionTitle dangerouslySetInnerHTML={{ __html: banner.title }} />
        <Clipboard />
        <Resources />
      </SectionContainer>
    </SectionWrapper>
  );
};
