/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "./components";

import { SandpackProvider } from ".";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <>
      <SandpackProvider template="nextjs" theme={themes.sandpackDark}>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackProvider>
    </>
  );
};
