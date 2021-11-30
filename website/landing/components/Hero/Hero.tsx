import { SandpackProvider } from "@codesandbox/sandpack-react";

import { useBreakpoint } from "../common/useBreakpoint";

import { HeroDesktop } from "./HeroDesktop";
import { files } from "./HeroDesktop/heroSandpackFiles";
import { HeroMobile } from "./HeroMobile";

export const Hero: React.FC = () => {
  const isDesktop = useBreakpoint("bp2");

  return isDesktop ? (
    <SandpackProvider
      customSetup={{
        dependencies: { "@stitches/react": "latest" },
        entry: "./index.js",
        files,
      }}
      initMode="immediate"
      template="react"
    >
      <HeroDesktop />{" "}
    </SandpackProvider>
  ) : (
    <HeroMobile />
  );
};
