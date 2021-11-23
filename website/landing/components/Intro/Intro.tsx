import { SectionWrapper, SectionContainer } from "../common";

import { Examples } from "./Examples";
import { Header } from "./Header";
import { SandpackExampleProvider } from "./SandpackExample";
import { LayoutExampleProvider } from "./Sections/LayoutContext";

export const Intro: React.FC = () => {
  return (
    <SandpackExampleProvider>
      <SectionWrapper>
        <SectionContainer
          css={{
            "@bp2": {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            },
          }}
        >
          <Header />
          <LayoutExampleProvider>
            <Examples />
          </LayoutExampleProvider>
        </SectionContainer>
      </SectionWrapper>
    </SandpackExampleProvider>
  );
};
