import React from "react";

import { SandpackCodeEditor, SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout, Sandpack } from "../..";

import { SandpackConsole, SandpackConsoleRef } from "./SandpackConsole";

export default {
  title: "components/Console",
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-explicit-any */
const files = (full: boolean): any => ({
  "/App.js": `export default function App() {
  
    return (
      <>
        <p>Primitives</p>
        <button onClick={() => console.log("Lorem ipsum")}>string</button>
        <button onClick={() => console.log(123)}>number</button>
        <button onClick={() => console.log(true)}>boolean</button>
        <button onClick={() => console.log(undefined)}>undefined</button>
        <button onClick={() => console.log(null)}>null</button>
        
        ${
          full
            ? `<p>Others</p>
        <button onClick={() => console.log(new Date())}>Date</button>
        <button onClick={() => console.log(NaN)}>NaN</button>
        <button onClick={() => console.log(new RegExp("//"))}>Regex</button>
        <button onClick={() => console.log(new Error("Foo"))}>Error</button>

        <button onClick={() => console.log(document.querySelector("button"))}>Log a node</button>
        <button onClick={() => console.log(document.querySelectorAll("button"))}>Log nodes</button>
        <button onClick={() => console.log(document.querySelector("body"))}>Log body</button>

        <button onClick={() => console.log(()=>{}, function foo(){})}>Log function</button>

        <button onClick={() => console.log(window)}>Log window</button>
        <button onClick={() => console.log({ foo: [] })}>Log object</button>
        <button onClick={() => console.log({foo: [], baz: () => {}})}>Log object II</button>
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
        <button onClick={() => console.clear()}>Console.clear</button>`
            : ""
        }
      </>
    );
  }
  `,
});

export const Main: React.FC = () => {
  const [showHeader, setShowHeader] = React.useState(true);
  const [showSyntaxErrors, setShowSyntaxErrors] = React.useState(true);

  return (
    <SandpackProvider files={files(true)} template="react">
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>

      <SandpackLayout style={{ marginTop: 12 }}>
        <SandpackConsole
          showHeader={showHeader}
          showSyntaxError={showSyntaxErrors}
        />
      </SandpackLayout>

      <br />

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
          checked={showSyntaxErrors}
          onChange={({ target }): void => setShowSyntaxErrors(target.checked)}
          type="checkbox"
        />
        Show syntax errors
      </label>
    </SandpackProvider>
  );
};

export const Preset: React.FC = () => {
  return (
    <div style={{ width: "auto" }}>
      <Sandpack template="react" />

      <br />

      <Sandpack
        files={files(false)}
        options={{ showConsoleButton: true, showConsole: true }}
        template="react"
      />

      <br />

      <Sandpack
        files={files(false)}
        options={{ showConsoleButton: false, showConsole: true }}
        template="react"
      />

      <br />

      <Sandpack
        files={files(false)}
        options={{ showConsoleButton: true, showConsole: false }}
        template="react"
      />
    </div>
  );
};

export const ImperativeReset: React.FC = () => {
  const consoleRef = React.useRef<SandpackConsoleRef>(null);

  const resetLogs = () => {
    consoleRef.current?.reset();
  };

  return (
    <SandpackProvider>
      <SandpackCodeEditor />
      <SandpackPreview />
      <button onClick={resetLogs}>Reset logs</button>
      <SandpackConsole ref={consoleRef} />
    </SandpackProvider>
  );
};
