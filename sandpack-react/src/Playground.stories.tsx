/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "./components";
import { useSandpack } from "./hooks";

import { SandpackProvider } from ".";

export default {
  title: "Intro/Playground",
};

const AddFile = () => {
  const { sandpack } = useSandpack();
  return (
    <button
      onClick={() => {
        sandpack.addFile(
          "/pages/foo/index.js",
          `export default () => {
  return "foo"
}`
        );
      }}
    >
      Add file
    </button>
  );
};

export const Basic: React.FC = () => {
  return (
    <>
      <SandpackProvider template="nextjs" theme={themes.sandpackDark}>
        <AddFile />
        <SandpackFileExplorer />
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackProvider>
    </>
  );
};
