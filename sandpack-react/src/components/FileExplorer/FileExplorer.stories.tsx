import * as React from "react";

import { SandpackLayout, SandpackCodeEditor, SandpackProvider } from "../../";

import { FileExplorer } from "./";

export default {
  title: "components/File Explorer",
};

export const Component: React.FC = () => (
  <>
    <SandpackProvider
      customSetup={{
        entry: "/index.tsx",
        files: {
          "/index.tsx": "",
          "/src/app.tsx": "",
          "/src/components/button.tsx": "",
          "/src/components/text.tsx": "",
        },
      }}
      template="react"
    >
      <SandpackLayout>
        <FileExplorer />

        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
    <SandpackProvider
      customSetup={{
        entry: "/index.tsx",
        files: {
          "/index.tsx": "",
          "/src/app.tsx": "",
          "/src/components/button.tsx": "",
          "/src/components/text.tsx": "",
        },
      }}
      template="react"
    >
      <SandpackLayout theme="dark">
        <FileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </>
);
