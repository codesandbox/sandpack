import type { Story } from "@storybook/react";
import React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";
import type { SandpackTheme } from "../../types";
import { SandpackCodeEditor } from "../CodeEditor";

import type { CodeViewerProps } from ".";
import { SandpackCodeViewer } from ".";

export default {
  title: "components/Code Viewer",
  component: SandpackCodeViewer,
};

const githubLightTheme: SandpackTheme = {
  palette: {
    activeText: "#1f2933",
    defaultText: "#757678",
    inactiveText: "#e4e7eb",
    activeBackground: "#e4e7eb",
    defaultBackground: "#f8f9fb",
    inputBackground: "#ffffff",
    accent: "#64D2FF",
    errorBackground: "#ffcdca",
    errorForeground: "#811e18",
  },
  syntax: {
    plain: "#393A34",
    comment: { color: "#999988", fontStyle: "italic" },
    keyword: "#e3116c",
    tag: "#22863a",
    punctuation: "#393A34",
    definition: "#6f42c1",
    property: "#36acaa",
    static: "#d73a49",
    string: "#393A34",
  },
  typography: {
    bodyFont:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    monoFont:
      '"Fira Mono", "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace',
    fontSize: "14px",
  },
};

export const Component: Story<CodeViewerProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: `
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
          `,
        },
      },
    }}
  >
    <SandpackThemeProvider theme={githubLightTheme}>
      <SandpackCodeEditor {...args} />
      <SandpackCodeViewer {...args} />
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
