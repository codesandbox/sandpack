import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";

import * as mocks from "./languages-mocks";

import { CodeEditor } from "./";

const stories = storiesOf("components/CodeMirror", module);

Object.entries(mocks).forEach(([lang, code]) =>
  stories.add(lang, () => (
    <SandpackProvider>
      <SandpackThemeProvider>
        <CodeEditor
          code={code}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fileType={lang as any}
          id={lang}
          initMode="immediate"
          showLineNumbers={false}
        />
      </SandpackThemeProvider>
    </SandpackProvider>
  ))
);
