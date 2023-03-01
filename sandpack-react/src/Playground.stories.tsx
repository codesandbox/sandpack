/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";
import { SandpackProvider } from ".";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "./components";

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
