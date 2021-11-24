import type { MotionValue } from "framer-motion";

import { AnimatedBox } from "../../common";

interface HeroMainProps {
  translateY: MotionValue<string>;
}
export const HeroMain: React.FC<HeroMainProps> = ({ children, translateY }) => {
  return (
    <AnimatedBox
      css={{
        $$baseLevel: "1",
        $$editorLevel: "2",

        alignItems: "flex-start",
        bottom: 0,
        display: "flex",
        height: "100vh",
        justifyContent: "flex-end",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        width: "100vw",
        maxWidth: "2560px",
        zIndex: "$$baseLevel",

        "> *": {
          flexShrink: 0,
          height: "100%",
          width: "100%",
        },

        ".custom-stack__hero": {
          height: "100%",
          width: "100%",
        },
      }}
      initial={false}
      style={{
        translateY,
      }}
      layout
    >
      {children}
    </AnimatedBox>
  );
};
