import {
  Sandpack as SandpackDefault,
  SandpackLayout as SandpackLayoutDefault,
} from "@codesandbox/sandpack-react";
import React from "react";

const Sandpack: React.FC = (props) => (
  <SandpackDefault
    options={{ editorHeight: 400, ...(props?.options ?? {}) }}
    theme="dark"
    {...props}
  />
);

const SandpackLayout: React.FC = (props) => (
  <SandpackLayoutDefault theme="dark" {...props} />
);

export { Sandpack, SandpackLayout };
