import type { Story } from "@storybook/react";
import React, { useState } from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";
import type { CodeMirrorProps } from "../CodeEditor/CodeMirror";

import type { CodeViewerProps } from ".";
import { SandpackCodeViewer } from ".";

export default {
  title: "components/Code Viewer",
  component: SandpackCodeViewer,
};

export const Component: Story<CodeViewerProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: `const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`,
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeViewer showLineNumbers {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const Decorators: React.FC = () => {
  return (
    <SandpackProvider
      customSetup={{
        entry: "/index.js",
        files: {
          "/index.js": {
            code: `const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];

export default function List() {
  const [text, setText] = useState("")
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`,
          },
        },
      }}
    >
      <style>
        {`.highlight {
        background: #1ea7fd2b;
        border-radius: 4px;
      }
      .widget {
        border: 1px solid #1ea7fd;
        border-radius: 2px;
        padding: 2px 4px 2px 12px;
        margin-left: 6px;
        position: relative;
      }

      .widget:before {
        content: "1";
        background: #1ea7fd;
        border-radius: 100%;
        position: absolute;
        width: 16px;
        display: block;
        height: 16px;
        left: -8px;
        top: 2px;
        font-size: 11px;
        text-align: center;
        color: white;
        line-height: 17px;
      }
      `}
      </style>
      <SandpackThemeProvider>
        <SandpackCodeViewer
          decorators={[
            { className: "highlight", line: 1 },
            { className: "highlight", line: 9 },
            { className: "widget", line: 12, startColumn: 26, endColumn: 38 },
          ]}
          showLineNumbers
        />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
