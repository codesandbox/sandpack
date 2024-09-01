/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import type { Story } from "@storybook/react";
import * as React from "react";

import { Sandpack } from "../../";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../styles/themeContext";
import { SandpackPreview } from "../Preview";

import type { CodeEditorProps } from "./";
import { SandpackCodeEditor } from "./";

export default {
  title: "components/Code Editor",
  component: SandpackCodeEditor,
};

export const Component: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
    }}
    files={{
      "/index.js": {
        code: 'const title = "This is a simple code editor"',
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ShowTabs: Story<CodeEditorProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
    }}
    files={{
      "/index.js": {
        code: 'const title = "This is a simple code editor"',
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor showTabs {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const InlineError: React.FC = () => (
  <SandpackProvider
    files={{
      "/App.js": `export default function App() 
  return <h1>Hello world</h1>
}`,
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackCodeEditor showInlineErrors showLineNumbers />
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ClosableTabs: React.FC = () => (
  <SandpackProvider
    options={{ visibleFiles: ["/App.js", "/index.js", "/styles.css"] }}
    template="react"
    theme="dark"
  >
    <SandpackCodeEditor closableTabs />
  </SandpackProvider>
);

export const ExtensionAutocomplete: React.FC = () => {
  const [active, setActive] = React.useState(false);
  return (
    <>
      <button onClick={(): void => setActive((prev): boolean => !prev)}>
        Toggle
      </button>
      <SandpackProvider template="react">
        <SandpackThemeProvider>
          <SandpackCodeEditor
            extensions={active ? [autocompletion()] : []}
            extensionsKeymap={active ? [completionKeymap] : []}
            id="extensions"
          />
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  );
};

export const ReadOnly: React.FC = () => {
  return (
    <>
      <p>Read-only by file</p>
      <Sandpack
        customSetup={{ entry: "/index.tsx" }}
        files={{
          "/index.tsx": { code: "", hidden: true },
          "/App.tsx": { code: "Hello", readOnly: true, active: true },
          "/src/components/button.tsx": { code: "World", readOnly: false },
        }}
        options={{ showTabs: true, activeFile: "/App.tsx" }}
        template="react-ts"
      />

      <p>Read-only global</p>
      <Sandpack
        options={{ showTabs: true, readOnly: true }}
        template="react-ts"
      />

      <p>Read-only global and by file</p>
      <Sandpack
        files={{
          "/index.tsx": { code: "", hidden: true },
          "/src/App.tsx": { code: "Hello", readOnly: true },
          "/src/components/button.tsx": { code: "World", readOnly: false },
        }}
        options={{ showTabs: false, readOnly: true }}
        template="react-ts"
      />

      <p>Read-only global, but no label</p>
      <Sandpack
        files={{
          "/index.tsx": { code: "", hidden: true },
          "/src/App.tsx": { code: "Hello", readOnly: true },
          "/src/components/button.tsx": { code: "World", readOnly: false },
        }}
        options={{ showTabs: false, readOnly: true, showReadOnly: false }}
        template="react-ts"
      />

      <p>Read-only by file, but no label</p>
      <Sandpack
        files={{
          "/index.tsx": { code: "", hidden: true },
          "/src/App.tsx": { code: "Hello", readOnly: true, active: true },
          "/src/components/button.tsx": { code: "World", readOnly: false },
        }}
        options={{ showTabs: true, readOnly: false, showReadOnly: false }}
        template="react-ts"
      />
    </>
  );
};
