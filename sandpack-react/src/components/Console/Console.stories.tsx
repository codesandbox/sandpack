import React, { useState } from "react";

import { SandpackCodeEditor, SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout, Sandpack } from "../..";

import type { SandpackConsoleRef } from "./SandpackConsole";
import { SandpackConsole } from "./SandpackConsole";

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

export const StandaloneMode = () => (
  <SandpackProvider
    files={{
      "/.eslintrc.js": `module.exports = {
  rules: { 
    "no-unused-vars": "error",
    "no-console": "error",
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}`,
      "/index.js": `const helloWorld = "";

console.log("foo");`,

      "/package.json": JSON.stringify({
        devDependencies: {
          eslint: "^8.0.1",
        },
        scripts: { start: "eslint index.js" },
      }),
    }}
    options={{ visibleFiles: ["/index.js", "/.eslintrc.js"] }}
    template="node"
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackConsole standalone />
    </SandpackLayout>
  </SandpackProvider>
);

export const MaxMessageCount = () => {
  const [mode, setMode] = useState("client");
  const [maxMessageCount, setMaxMessageCount] = useState(5);

  return (
    <>
      <SandpackProvider
        key={mode}
        files={{
          "/index.js": `new Array(10).fill('').forEach((_, i) => console.log(i));`,
          "/package.json": JSON.stringify({
            scripts: { start: "node index.js" },
          }),
        }}
        options={{ visibleFiles: ["/index.js"], recompileDelay: 500 }}
        template={mode === "client" ? "vanilla" : "node"}
      >
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackConsole
            maxMessageCount={Number(maxMessageCount)}
            standalone
          />
        </SandpackLayout>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            justifyItems: "left",
            width: "fit-content",
          }}
        >
          <button
            onClick={() => setMode(mode === "client" ? "server" : "client")}
          >
            Toggle mode: {mode}
          </button>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Max Message Count</span>
            <input
              onChange={(e) => setMaxMessageCount(+e.target.value)}
              type="number"
              value={maxMessageCount}
            />
          </label>
        </div>
      </SandpackProvider>
    </>
  );
};

export const StaticTemplate: React.FC = () => {
  return (
    <Sandpack
      files={{
        "index.html": `<!DOCTYPE html>
<html>

<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/styles.css" />
  <script>
    console.log("fooo")
  </script>
</head>

<body>
  <h1>Hello world</h1>
  <button onclick="console.log(document.querySelectorAll('button'))">Log</button>
  <button onclick="console.log(document.querySelectorAll('button'))">Log</button>
</body>

</html>`,
      }}
      options={{ showConsole: true }}
      template="static"
    />
  );
};

export const NodeTemplate: React.FC = () => {
  return <Sandpack options={{ showConsole: true }} template="node" />;
};

export const ReactTemplate: React.FC = () => {
  return (
    <Sandpack
      files={{
        "App.js": `import { useState } from "react"
export default function App() {
    const foo = useState("")
    console.log(foo)
    return (
      <>
      </>
    )
}`,
      }}
      options={{ showConsole: true }}
      template="react"
    />
  );
};
