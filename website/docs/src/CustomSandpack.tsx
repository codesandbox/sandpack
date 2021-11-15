import type { SandpackTheme } from "@codesandbox/sandpack-react";
import {
  Sandpack as SandpackDefault,
  SandpackLayout as SandpackLayoutDefault,
} from "@codesandbox/sandpack-react";
import React from "react";

import customTheme from "./scss/sandpack-theme";

const Sandpack: React.FC = (props) => (
  <SandpackDefault theme={customTheme as SandpackTheme} {...props} />
);

const SandpackLayout: React.FC = (props) => (
  <SandpackLayoutDefault theme={customTheme as SandpackTheme} {...props} />
);

export { Sandpack, SandpackLayout };
