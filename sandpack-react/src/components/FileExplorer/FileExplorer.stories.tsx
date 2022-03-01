import * as React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackCodeEditor } from "../../components/CodeEditor";
import { SandpackProvider } from "../../contexts/sandpackContext";

import { FileExplorer } from "./";
import { File } from "./File";
import { Directory } from "./Directory";

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

export const LongFileTree: React.FC = () => (
  <SandpackProvider
    customSetup={{
      entry: "/index.tsx",
      files: new Array(20).fill(" ").reduce((acc, _curr, index) => {
        acc[`/src/com${index}.js`] = "";

        return acc;
      }, {}),
    }}
  >
    <SandpackLayout>
      <FileExplorer />
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
        depth={1}
        activePath="file.ts"
        prefixedPath="/src"
        files={{ App: { code: "" } }}
        selectFile={() => {}}
      />
    </SandpackLayout>
  </SandpackProvider>
);
