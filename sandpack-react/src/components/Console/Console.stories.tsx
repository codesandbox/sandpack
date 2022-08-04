import React from "react";

import { SandpackCodeEditor, SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout } from "../..";

import { SandpackConsole } from "./SandpackConsole";

export default {
  title: "components/Console",
};

export const ReactDevTool: React.FC = () => {
  const [showHeader, setShowHeader] = React.useState(true);
  const [showClearButton, setShowClearButton] = React.useState(true);
  const [showSyntaxErrors, setShowSyntaxErrors] = React.useState(true);

  return (
    <SandpackProvider
      files={{
        "/App.js": `export default function App() {
  
    return (
      <>
        <button onClick={() => console.log(document.createElement("a"))}>Log node</button>
        <button onClick={() => console.log(()=>{}, function foo(){})}>Log function</button>
        <button onClick={() => console.log({ foo: [] })}>Log object</button>
        <button onClick={() => console.log(["foo", 123, [], ["foo2"], () => {}])}>Multiples types</button>
        <button onClick={() => {
          console.log("foo", "baz")
          console.error("foo", "baz")
        }}>
          Multiples logs
        </button>
        <button onClick={() => console.error({ foo: [] })}>Log error</button>
        <button onClick={() => console.warn({ foo: [] })}>Log warning</button>
        <button onClick={() => console.info({ foo: [] })}>Log info</button>
        <button onClick={() => console.clear()}>Console.clear</button>
      </>
    );
  }
  `,
      }}
      template="react"
    >
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>

      <label>
        <input
          checked={showHeader}
          onChange={({ target }): void => setShowHeader(target.checked)}
          type="checkbox"
        />
        Show header
      </label>

      <label>
        <input
          checked={showClearButton}
          onChange={({ target }): void => setShowClearButton(target.checked)}
          type="checkbox"
        />
        Show clear button
      </label>

      <label>
        <input
          checked={showSyntaxErrors}
          onChange={({ target }): void => setShowSyntaxErrors(target.checked)}
          type="checkbox"
        />
        Show syntax errors
      </label>

      <SandpackLayout style={{ marginTop: 12 }}>
        <SandpackConsole
          showClearButton={showClearButton}
          showHeader={showHeader}
          showSyntaxError={showSyntaxErrors}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};
