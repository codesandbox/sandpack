import type { Story } from "@storybook/react";
import React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";
import { SandpackPreview } from "../Preview";

import type { CodeEditorProps } from "./index";
import { SandpackCodeEditor } from "./index";

export default {
  title: "components/Code Editor",
  component: SandpackCodeEditor,
};

export const Component: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: 'const title = "This is a simple code editor"',
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const InlineError: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor showInlineErrors showLineNumbers />
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor showLineNumbers />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider>
      <SandpackCodeEditor />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const DarkTheme: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeEditor />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ClosableTabs: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeEditor closableTabs />
    </SandpackThemeProvider>
  </SandpackProvider>
);
