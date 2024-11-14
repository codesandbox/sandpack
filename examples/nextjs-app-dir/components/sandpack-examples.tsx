"use client";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { useState } from "react";

const TEMPLATES = ["vite-react-ts", "nextjs", "rust", "python", "node"];

/**
 * The only reason this is a separate import, is so
 * we don't need to make the full page 'use client', but only this copmponent.
 */
export const SandpackExamples = () => {
  const [state, setState] = useState(
    window.localStorage["template"] || TEMPLATES[0]
  );

  return (
    <>
      <select
        value={state}
        onChange={(event) => {
          window.localStorage["template"] = event.target.value;
          setState(event.target.value);
        }}
      >
        {TEMPLATES.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>

      <SandpackProvider
        key={state}
        template={state}
        options={{
          vmEnvironmentApiUrl: (id) => `/api/sandbox/${id}`,
        }}
      >
        <SandpackLayout style={{ "--sp-layout-height": "500px" }}>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
