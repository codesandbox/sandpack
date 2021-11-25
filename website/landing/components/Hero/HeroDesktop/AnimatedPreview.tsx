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
  return (
    <Box
      as="section"
      css={{
        alignItems: "center",
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
          width: "100%",
        }}
        style={{ scale: 0.5 }}
      >
        <Button>
          <Text
            as="span"
            css={{ fontFamily: "sans-serif", fontSize: "3.2rem" }}
          >
            npm install @codesandbox/sandpack-react
          </Text>
        </Button>
        <Box css={{ alignItems: "center", display: "flex", gap: "4rem" }}>
          <a href="#placeholder" target="_blank">
            <Text
              as="span"
              css={{
                fontFamily: "sans-serif",
                fontSize: "3.2rem",
                fontWeight: "$semiBold",
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
                fontSize: "3.2rem",
                fontWeight: "$semiBold",
              }}
            >
              Docs
            </Text>
          </a>
        </Box>
      </AnimatedBox>

      <AnimatedBox
        css={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          transformOrigin: "center right",
          width: "100%",

          svg: {
            height: 434,
            width: 356,
          },
        }}
        style={{
          scale: 0.5,
          translateY: 77, // Arbitrary value to compensate the sandpack logo scale
        }}
      >
        <PreviewLogo />
      </AnimatedBox>

      {/* Title */}
      <AnimatedBox
        style={{
          display: "flex",
          transformOrigin: "bottom right",
          scale: 0.5,
          width: "100%",
        }}
      >
        <SandpackTitle />
      </AnimatedBox>
    </Box>
  );
};
