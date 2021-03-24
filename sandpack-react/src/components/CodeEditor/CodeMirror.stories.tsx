import React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";

import { CodeEditor } from "./index";

export default {
  title: "components/CodeMirror",
  component: CodeEditor,
};

export const JustEditor: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider>
      <CodeEditor
        code="const c = a+b;"
        fileType="jsx"
        onCodeUpdate={() => console.log("code update")}
      />
    </SandpackThemeProvider>
  </SandpackProvider>
);
