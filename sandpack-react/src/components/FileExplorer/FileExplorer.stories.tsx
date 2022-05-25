import * as React from "react";

import { SandpackLayout, SandpackCodeEditor, SandpackProvider } from "../../";

import { Directory } from "./Directory";
import { File } from "./File";

import { SandpackFileExplorer } from "./";

export default {
  title: "components/File Explorer",
};

export const Component: React.FC = () => (
  <>
    <SandpackProvider
      customSetup={{
        entry: "/index.tsx",
      }}
      files={{
        "/index.tsx": "",
        "/src/app.tsx": "",
        "/src/components/button.tsx": "",
      }}
      template="react"
    >
      <SandpackLayout>
        <SandpackFileExplorer />

        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider
      customSetup={{
        entry: "/index.tsx",
      }}
      files={{
        "/index.tsx": "",
        "/src/app.tsx": "",
        "/src/components/button.tsx": "",
      }}
      template="react"
      theme="dark"
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </>
);

export const LongFileTree: React.FC = () => (
  <SandpackProvider
    files={new Array(20).fill(" ").reduce((acc, _curr, index) => {
      acc[`/src/com${index}.js`] = "";

      return acc;
    }, {})}
    template="react"
  >
    <SandpackLayout>
      <SandpackFileExplorer />
    </SandpackLayout>
  </SandpackProvider>
);

export const FileStory: React.FC = () => (
  <SandpackProvider>
    <SandpackLayout>
      <File depth={1} path="file.ts" />
    </SandpackLayout>
  </SandpackProvider>
);

export const DirectoryIconStory: React.FC = () => (
  <SandpackProvider>
    <SandpackLayout>
      <Directory
        activeFile="file.ts"
        depth={1}
        files={{ App: { code: "" } }}
        prefixedPath="/src"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectFile={(): any => null}
      />
    </SandpackLayout>
  </SandpackProvider>
);
