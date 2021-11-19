import type { SandpackTheme } from "@codesandbox/sandpack-react";
import {
  Sandpack as SandpackDefault,
  SandpackLayout as SandpackLayoutDefault,
} from "@codesandbox/sandpack-react";
import React from "react";

const Sandpack: React.FC = (props) => (
  <SandpackDefault theme="sandpack-dark" {...props} />
);

const SandpackLayout: React.FC = (props) => (
  <SandpackLayoutDefault theme="sandpack-dark" {...props} />
);

export { Sandpack, SandpackLayout };
