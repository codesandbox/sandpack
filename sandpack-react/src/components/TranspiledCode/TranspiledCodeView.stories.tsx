import React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackStack } from "../../common/Stack";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeEditor } from "../CodeEditor";

import { SandpackTranspiledCode } from "./index";

export default {
  title: "components/Transpiled Code View",
};

export const Component: React.FC = () => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: `const text = 'Hello World!'
const str = \`<div>\${text}</div>\`
`,
        },
      },
      dependencies: { "@babel/runtime": "latest" },
    }}
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
    </SandpackLayout>
  </SandpackProvider>
);
