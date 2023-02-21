/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React, { useState } from "react";

import type { CodeEditorProps } from "./components/CodeEditor";
import { Sandpack } from "./presets";
import { SANDBOX_TEMPLATES } from "./templates";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackTests,
} from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <Sandpack
      files={{ "main.js": "" }}
      customSetup={{ environment: "vm", entry: "/main.js" }}
      theme={themes.sandpackDark}
    />
  );
};
