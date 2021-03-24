import React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeViewer } from "../CodeViewer";

import { FileTabs } from "./index";

export default {
  title: "components/File Tabs",
};

export const Component: React.FC = () => (
  <SandpackProvider
    customSetup={{
      entry: "/index.tsx",
      files: {
        "/index.tsx": "",
        "/src/app.tsx": { code: "", active: true },
        "/src/components/button.tsx": "",
      },
    }}
  >
    <SandpackLayout>
      <FileTabs />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithHiddenFiles: React.FC = () => (
  <SandpackProvider
    customSetup={{
      entry: "/index.tsx",
      files: {
        "/index.tsx": { code: "", hidden: true },
        "/src/app.tsx": "Hello",
        "/src/components/button.tsx": "World",
      },
    }}
  >
    <SandpackLayout>
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);
