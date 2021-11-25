import { useTransform, useViewportScroll } from "framer-motion";

import { AnimatedBox, Box, Button, Text } from "../../common";

import { PreviewLogo } from "./PreviewLogo";
import { SandpackTitle } from "./SandpackTitle";

interface AnimatedPreviewProps {
  heroTop: number;
  heroScroll: number;
}
export const AnimatedPreview: React.FC<AnimatedPreviewProps> = ({
  heroTop,
  heroScroll,
}) => {
  // Scroll animations start
  const { scrollY } = useViewportScroll();

  const containerScrollInput = [heroTop, heroTop + heroScroll * 0.75];

  const scaleOutput = [2, 1];
  const scale = useTransform(scrollY, containerScrollInput, scaleOutput);

  const opacityOutput = [1, 0];
  const opacity = useTransform(scrollY, containerScrollInput, opacityOutput);

  return (
    <Box
      as="section"
      css={{
        alignItems: "flex-end",
        background: "$surface",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Header */}
      <AnimatedBox
        css={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          transformOrigin: "top right",
          width: "50%",
        }}
        style={{ scale }}
      >
        <Button>
          <Text
            as="span"
            css={{
              fontFamily: "sans-serif",
              fontWeight: "normal",
              fontSize: "1.6rem",
            }}
          >
            npm install @codesandbox/sandpack-react
          </Text>
        </Button>
        <Box css={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <a href="#placeholder" target="_blank">
            <Text
              as="span"
              css={{
                fontFamily: "sans-serif",
                fontSize: "1.6rem",
                fontWeight: "normal",
              }}
            >
              Github
            </Text>
          </a>
          <a href="#placeholder" target="_blank">
            <Text
              as="span"
              css={{
                fontFamily: "sans-serif",
                fontSize: "1.6rem",
                fontWeight: "normal",
              }}
            >
              Docs
            </Text>
          </a>
        </Box>
      </AnimatedBox>

      {/* <AnimatedBox
        css={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          transformOrigin: "center right",
          width: "50%",
        }}
        style={{
          scale,
        }}
      >
        <PreviewLogo />
      </AnimatedBox> */}

      {/* Title */}
      <AnimatedBox
        css={{
          display: "flex",
          transformOrigin: "bottom right",
          width: "50%",
        }}
        style={{ scale }}
      >
        <SandpackTitle />
      </AnimatedBox>
    </Box>
  );
};
