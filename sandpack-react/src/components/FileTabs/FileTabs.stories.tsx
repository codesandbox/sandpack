import * as React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackCodeViewer } from "../CodeViewer";
import { Sandpack } from "../../";

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

export const WithClosableTabs: React.FC = () => (
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
      <FileTabs closableTabs />
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

export const ReadOnlyByFile: React.FC = () => (
  <Sandpack
    customSetup={{ entry: "/index.tsx", main: "/App.tsx" }}
    files={{
      "/index.tsx": { code: "", hidden: true },
      "/src/app.tsx": { code: "Hello", readOnly: true },
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
    options={{ showTabs: true, readOnly: true }}
    files={{
      "/index.tsx": { code: "", hidden: true },
      "/src/app.tsx": { code: "Hello", readOnly: true },
      "/src/components/button.tsx": { code: "World", readOnly: false },
    }}
    template="react-ts"
  />
);
