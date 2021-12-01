import React from "react";
import { useInView } from "react-intersection-observer";

import { Box, Card, CardDescription, CardTitle } from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

import { ExampleIllustration } from "./ExampleIllustration";

interface Example {
  title: string;
  description: string;
  illustrationKey: string;
}

interface UsageExampleProps {
  example: Example;
  exampleIndex: number;
}
export const UsageExample: React.FC<UsageExampleProps> = ({
  example,
  exampleIndex,
}) => {
  const shouldAnimate = useBreakpoint("bp2");
  const { ref, inView } = useInView({
    threshold: 0,
  });

  return (
    <Box css={{ height: "100vh", maxHeight: "1080px" }}>
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          justifyContent: "center",
          width: "100%",
          height: "100%",

          "@bp2": {
            alignItems: "center",
            flexDirection: exampleIndex % 2 === 0 ? "row-reverse" : "row",
            "--gap": "240px",

            scrollSnapAlign: "center",
            width: "initial",
          },

          "@bp3": {
            "--gap": "320px",
          },
        }}
      >
        <Box ref={ref}>
          <ExampleIllustration
            illustrationKey={example.illustrationKey}
            visible={inView || !shouldAnimate}
          />
        </Box>
        <Box>
          <Card>
            <CardTitle>{example.title}</CardTitle>
            <CardDescription
              dangerouslySetInnerHTML={{
                __html: example.description,
              }}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
