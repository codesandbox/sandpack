import type { SandpackTheme } from "@codesandbox/sandpack-react";
import {
  Sandpack as SandpackDefault,
  SandpackLayout as SandpackLayoutDefault,
  SandpackLayoutProps,
  SandpackProps,
} from "@codesandbox/sandpack-react";
import React from "react";

import customTheme from "./scss/sandpack-theme";

const Sandpack: React.FC<SandpackProps> = (props) => (
  <SandpackDefault theme={customTheme as SandpackTheme} {...props} />
);

const SandpackLayout: React.FC<SandpackLayoutProps> = (props) => (
  <SandpackLayoutDefault theme={customTheme as SandpackTheme} {...props} />
);

export { Sandpack, SandpackLayout };
