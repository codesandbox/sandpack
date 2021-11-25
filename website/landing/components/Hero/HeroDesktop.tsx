import {
  ClasserProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";
import type { CSS } from "@stitches/react";
import { AnimateSharedLayout, motion } from "framer-motion";

import { styled } from "../../stitches.config";
import { Box, SectionContainer, SectionWrapper } from "../common";

import { files } from "./heroSandpackFiles";

// TODO: move to common folder;
const AnimatedBox = styled(motion.div, {});

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

interface SectionProps {
  wrapperStyles?: CSS;
  containerStyles?: CSS;
}
const Section: React.FC<SectionProps> = ({
  containerStyles,
  children,
  wrapperStyles,
}) => {
  return (
    <SectionWrapper css={wrapperStyles}>
      <SectionContainer css={containerStyles}>{children}</SectionContainer>
    </SectionWrapper>
  );
};

const HeroMain: React.FC = ({ children }) => {
  return (
    <Box
      css={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        height: "100vh",
        overflow: "hidden",
        width: "100vw",

        "> *": {
          position: "relative",
          overflowY: "auto",
        },

        ".custom-stack__hero": {
          height: "100%",
          width: "100%",
        },
      }}
    >
      {children}
    </Box>
  );
};

const HeroEditor: React.FC = () => {
  return (
    <AnimatedBox>
      <SandpackCodeEditor />
    </AnimatedBox>
  );
};

const HeroPreview: React.FC = () => {
  return (
    <AnimatedBox>
      <SandpackPreview />
    </AnimatedBox>
  );
};

export const HeroDesktop: React.FC = () => {
  return (
    <>
      <SandpackWrapper>
        <Section containerStyles={{ margin: 0 }}>
          <AnimateSharedLayout>
            <HeroMain>
              <HeroEditor />
              <HeroPreview />
            </HeroMain>
          </AnimateSharedLayout>
        </Section>
      </SandpackWrapper>
    </>
  );
};
