import React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackCodeEditor } from "../../components/CodeEditor";
import { SandpackProvider } from "../../contexts/sandpackContext";

import { FileExplorer } from "./index";

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
        },
      }}
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
        },
      }}
    >
      <SandpackLayout theme="night-owl">
        <FileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </>
);
