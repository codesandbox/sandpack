import type { Story } from "@storybook/react";
import React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";

import type { CodeViewerProps } from ".";
import { SandpackCodeViewer } from ".";

export default {
  title: "components/Code Viewer",
  component: SandpackCodeViewer,
};

export const Component: Story<CodeViewerProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: 'const title = "This is not editable" // this is a comaent',
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeViewer {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);
