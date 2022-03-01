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

export const ShowLineNumber: React.FC = () => (
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
      id="less"
      initMode="immediate"
      showLineNumbers
    />
  </SandpackProvider>
);

export const WrapContent: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={Array(20).fill("Lorem ipsum").join("")}
      id="wrap"
      initMode="immediate"
      showLineNumbers
      wrapContent
    />
  </SandpackProvider>
);

export const Decorators: React.FC = () => (
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
      id="decorators"
      initMode="immediate"
    />
  </SandpackProvider>
);
