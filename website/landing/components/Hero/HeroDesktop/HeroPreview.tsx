import { SandpackPreview } from "@codesandbox/sandpack-react";

import { AnimatedBox, Box } from "../../common";

interface HeroPreviewProps {
  animationComplete: boolean;
}
export const HeroPreview: React.FC<HeroPreviewProps> = ({
  animationComplete,
}) => {
  return (
    <Box
      css={{
        fontSize:
          "clamp(10px, calc((100vw * 2) / 720 * 10), calc((100vw * 2) / 960 * 10))",
      }}
    >
      <AnimatedBox
        css={{
          background: "$surface",
          fontSize: "1rem" /* TODO: responsive font-sizes (?) */,
          lineHeight: 1.6,
          letterSpacing: "-0.025em",
          height: "100%",
          position: "relative",
          width: "100vw",
          maxWidth: "2560px",
        }}
        initial={false}
      >
        <Box
          css={{
            height: "100%",
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "auto",
            width: "50%",
            visibility: animationComplete ? "visible" : "hidden",
          }}
        >
          <SandpackPreview />
        </Box>
      </AnimatedBox>
    </Box>
  );
};
