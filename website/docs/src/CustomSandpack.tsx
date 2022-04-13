import {
  Sandpack as SandpackDefault,
  SandpackLayout as SandpackLayoutDefault,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import React from "react";

const Sandpack: React.FC = (props) => (
  <SandpackDefault
    options={{ editorHeight: 400, ...(props?.options ?? {}) }}
    theme={sandpackDark}
    {...props}
  />
);

const SandpackLayout: React.FC = (props) => (
  <SandpackLayoutDefault theme={sandpackDark} {...props} />
);

export { Sandpack, SandpackLayout };
