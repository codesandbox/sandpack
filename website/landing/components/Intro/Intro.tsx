import { Box } from "../common";

import { Examples } from "./Examples";
import { Header } from "./Header";
import { SandpackExampleProvider } from "./SandpackExample";
import { LayoutExampleProvider } from "./Sections/LayoutContext";

export const Intro: React.FC = () => {
  return (
    <SandpackExampleProvider>
      <Box
        as="section"
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: "200px 16px 0",
          width: "100%",
        }}
      >
        <Header />
        <LayoutExampleProvider>
          <Examples />
        </LayoutExampleProvider>
      </Box>
    </SandpackExampleProvider>
  );
};
