/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from "react";

import { SandpackCodeEditor } from "../../components/CodeEditor";
import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackLayout } from "../common/Layout";

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
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
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
        "/src/components/really-loooooooong-naaameeee.tsx": "",
      }}
      theme="dark"
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor closableTabs />
      </SandpackLayout>
    </SandpackProvider>
  </>
);

export const InitialCollapsedFolder: React.FC = () => (
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
    >
      <SandpackLayout>
        <SandpackFileExplorer initialCollapsedFolder={["/src/components/"]} />
        <SandpackCodeEditor closableTabs />
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
        "/src/components/really-loooooooong-naaameeee.tsx": "",
      }}
      theme="dark"
    >
      <SandpackLayout>
        <SandpackFileExplorer initialCollapsedFolder={["/src/components/"]} />
      </SandpackLayout>
    </SandpackProvider>
  </>
);

export const LongFileTree: React.FC = () => (
  <SandpackProvider
    customSetup={{
      entry: "/src/com0.js",
    }}
    files={new Array(20).fill(" ").reduce((acc, _curr, index) => {
      acc[`/src/com${index}.js`] = "";

      return acc;
    }, {})}
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
        selectFile={(): void => {
          //
        }}
        visibleFiles={[]}
      />
    </SandpackLayout>
  </SandpackProvider>
);

export const AutoHiddenFiles = (): JSX.Element => {
  const [files, setFiles] = React.useState({
    "/index.js": {
      code: "// index.js",
      active: true,
    },
    "/index2.js": {
      code: "// index2.js",
    },
    "/src/index.js": {
      code: "// this file is generated by vanilla template, but it is not needed",
      hidden: true,
    },
    "/hidden.js": {
      code: "// hidden.js",
      hidden: true,
    },
  });
  const [visibleFiles, setVisibleFiles] = React.useState([
    "/src/index.js",
    "/hidden.js",
  ]);

  const changeVisibleFiles = (): void => {
    if (!visibleFiles.includes("/index2.js")) {
      setVisibleFiles((prevVisibleFiles) => [
        ...prevVisibleFiles,
        "/index2.js",
      ]);
    }
  };

  const changeFiles = (): void => {
    if (!files["/test.js"]) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        ...{ "/test.js": { code: "// test" } },
      }));
    } else {
      setFiles((prevFiles) => ({
        ...prevFiles,
        ...{
          "/index.js": {
            active: true,
            code: `// ${String(Math.random() * 1000000)}`,
          },
        },
      }));
    }
  };

  return (
    <>
      <button onClick={changeVisibleFiles}>change visible files prop</button>

      <SandpackProvider
        customSetup={{
          entry: "/index.js",
        }}
        files={{
          "/index.js": {
            code: "// filename: index.js",
            active: true,
          },
          "/index2.js": {
            code: "// filename: index2.js",
          },
          "/src/index.js": {
            code: "// filename: src/index.js",
            hidden: true,
          },
          "/hidden.js": {
            code: "// filename: hidden.js",
            hidden: true,
          },
        }}
        options={{
          // @ts-ignore
          visibleFiles,
          activeFile: "/src/index.js",
        }}
        template={"vanilla"}
      >
        <SandpackLayout>
          <SandpackFileExplorer autoHiddenFiles />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>

      <br />
      <hr />
      <br />

      <button onClick={changeFiles}>change files</button>
      <SandpackProvider
        customSetup={{
          entry: "/index.js",
        }}
        files={files}
        template={"vanilla"}
      >
        <SandpackLayout>
          <SandpackFileExplorer autoHiddenFiles />
          <SandpackCodeEditor closableTabs />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
