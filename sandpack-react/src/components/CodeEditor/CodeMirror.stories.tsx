import { python } from "@codemirror/lang-python";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";

import * as mocks from "./languages-mocks";

import { CodeEditor } from "./index";
const stories = storiesOf("components/CodeMirror", module);

Object.entries(mocks).forEach(([languageName, mockFile]) =>
  stories.add(languageName, () => (
    <SandpackProvider>
      <CodeEditor
        code={mockFile}
        fileType={languageName}
        initMode="immediate"
        showLineNumbers={false}
      />
    </SandpackProvider>
  ))
);

stories.add("CustomLanguageShell", () => (
  <SandpackProvider>
    <CodeEditor
      additionalLanguages={[
        {
          name: "shell",
          extensions: ["sh"],
          language: new LanguageSupport(StreamLanguage.define(shell)),
        },
      ]}
      code={mocks.shell}
      filePath="example.sh"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
));

stories.add("CustomLanguagePython", () => (
  <SandpackProvider>
    <CodeEditor
      additionalLanguages={[
        {
          name: "python",
          extensions: ["py"],
          language: python(),
        },
      ]}
      code={mocks.python}
      fileType="python"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
));

stories.add("ShowLineNumber", () => (
  <SandpackProvider>
    <CodeEditor
      code={`
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}  
`}
      fileType="less"
      initMode="immediate"
      showLineNumbers
    />
  </SandpackProvider>
));

stories.add("WrapContent", () => (
  <SandpackProvider>
    <CodeEditor
      code={Array(20).fill("Lorem ipsum").join("")}
      initMode="immediate"
      showLineNumbers
      wrapContent
    />
  </SandpackProvider>
));

stories.add("Decorators", () => (
  <SandpackProvider>
    <style>
      {`.highlight, .widget {
        background: red;
      }`}
    </style>
    <CodeEditor
      code={`const people = [{
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
}`}
      decorators={[
        { className: "highlight", line: 1 },
        { className: "highlight", line: 9 },
        {
          className: "widget",
          elementAttributes: { "data-id": "2" },
          line: 13,
          startColumn: 8,
          endColumn: 17,
        },
        {
          className: "widget",
          elementAttributes: { "data-id": "1" },
          line: 12,
          startColumn: 26,
          endColumn: 38,
        },
      ]}
      fileType="jsx"
      initMode="immediate"
    />
  </SandpackProvider>
));
