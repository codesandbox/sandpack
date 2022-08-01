import React from "react";

import { SandpackCodeEditor, SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout } from "../..";

import { SandpackConsole } from "./SandpackConsole";

export default {
  title: "components/Console",
};

export const ReactDevTool: React.FC = () => (
  <SandpackProvider
    files={{
      "/App.js": `export default function App() {
  
    return (
      <>
        <button onClick={() => console.log({ foo: [] })}>Log object</button>
        <button onClick={() => {
          console.log("foo", "baz")
          console.error("foo", "baz")
        }}>
          Multiples logs
        </button>
        <button onClick={() => console.error({ foo: [] })}>Log error</button>
        <button onClick={() => console.warn({ foo: [] })}>Log warning</button>
        <button onClick={() => console.info({ foo: [] })}>Log info</button>
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

    <SandpackLayout style={{ marginTop: 12 }}>
      <SandpackConsole />
    </SandpackLayout>
  </SandpackProvider>
);
