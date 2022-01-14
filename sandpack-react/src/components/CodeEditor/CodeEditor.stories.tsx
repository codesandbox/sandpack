import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import type { Story } from "@storybook/react";
import * as React from "react";

import { Sandpack } from "../../";
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
    <SandpackThemeProvider theme="dark">
      <SandpackCodeEditor />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ClosableTabs: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider theme="dark">
      <SandpackCodeEditor closableTabs />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ExtensionAutocomplete: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor
        extensions={[autocompletion()]}
        extensionsKeymap={[completionKeymap]}
        id="extensions"
      />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReadOnlyByFile: React.FC = () => (
  <Sandpack
    customSetup={{ entry: "/index.tsx", main: "/App.tsx" }}
    files={{
      "/index.tsx": { code: "", hidden: true },
      "/src/App.tsx": { code: "Hello", readOnly: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    }}
    options={{ showTabs: true }}
    template="react-ts"
  />
);

export const ReadOnlyGlobal: React.FC = () => (
  <Sandpack options={{ showTabs: true, readOnly: true }} template="react-ts" />
);

export const ReadOnlyGlobalAndPerFile: React.FC = () => (
  <Sandpack
    options={{ showTabs: false, readOnly: true }}
    files={{
      "/index.tsx": { code: "", hidden: true },
      "/src/App.tsx": { code: "Hello", readOnly: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    }}
    template="react-ts"
  />
);
