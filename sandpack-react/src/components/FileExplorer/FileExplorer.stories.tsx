import * as React from "react";

import { SandpackLayout, SandpackCodeEditor, SandpackProvider } from "../../";

import { FileExplorer } from "./";

export default {
  title: "components/File Explorer",
};

export const Component: React.FC = () => (
  <>
    <SandpackProvider
      template="react"
      customSetup={{
        entry: "/index.tsx",
        files: {
          "/index.tsx": "",
          "/src/app.tsx": "",
          "/src/components/button.tsx": "",
          "/src/components/text.tsx": "",
        },
      }}
    >
      <SandpackLayout>
        <FileExplorer />

        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
    <SandpackProvider
      template="react"
      customSetup={{
        entry: "/index.tsx",
        files: {
          "/index.tsx": "",
          "/src/app.tsx": "",
          "/src/components/button.tsx": "",
          "/src/components/text.tsx": "",
        },
      }}
    >
      <SandpackLayout theme="dark">
        <FileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </>
);
