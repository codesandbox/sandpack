import { SandpackProvider } from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";

import { useBreakpoint } from "../common/useBreakpoint";

import { HeroDesktop } from "./HeroDesktop";
import { files } from "./HeroDesktop/heroSandpackFiles";
import { HeroMobile } from "./HeroMobile";

const CUSTOM_CLASSES_MAP = {
  "sp-stack": "custom-stack__hero",
};

export const Hero: React.FC = () => {
  const isDesktop = useBreakpoint("bp2");

  return isDesktop ? (
    <SandpackProvider
      customSetup={{
        dependencies: { "@stitches/react": "latest" },
        entry: "/index.js",
      }}
      files={files}
      options={{ initMode: "immediate", classes: CUSTOM_CLASSES_MAP }}
      template="react"
      theme={sandpackDark}
    >
      <HeroDesktop />{" "}
    </SandpackProvider>
  ) : (
    <HeroMobile />
  );
};
