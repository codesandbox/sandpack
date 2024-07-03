import { storiesOf } from "@storybook/react";
import React from "react";

import type { SandpackPredefinedTemplate } from "../";
import { SandpackLayout, SandpackProvider } from "../";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackPreview,
} from "../components";

import { SANDBOX_TEMPLATES } from ".";

const stories = storiesOf("presets/Template", module);

Object.keys(SANDBOX_TEMPLATES).forEach((template) =>
  stories.add(template, () => {
    const isNodeStatic =
      SANDBOX_TEMPLATES[template].environment === "node" ||
      SANDBOX_TEMPLATES[template].environment === "static";

    return (
      <SandpackProvider
        options={{
          bundlerTimeOut: 90000,
          experimental_enableServiceWorker: true,
          bundlerURL: "https://f6lh85-3000.csb.app",
          // bundlerURL: isNodeStatic
          //   ? undefined
          //   : "https://1-17-1-{{suffix}}-sandpack.codesandbox.io/",
        }}
        // teamId="642af90c-4717-4730-bad3-e4c1e37ca5e2"
        template={template as SandpackPredefinedTemplate}
        files={{
          "/public/logo.svg": `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">
            <title>React Logo</title>
            <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
            <g stroke="#61dafb" stroke-width="1" fill="none">
              <ellipse rx="11" ry="4.2"/>
              <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
              <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
          </svg>
          `,
          "/App.js": `export default function App() {
  return <>
    <h1>Hello world</h1>
    <img width="200" src="/public/logo.svg" />
  </>
}
          `,
        }}
      >
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showLineNumbers />
          <SandpackPreview showNavigator />
        </SandpackLayout>
        <br />
        <SandpackLayout>
          <SandpackConsole />
        </SandpackLayout>
      </SandpackProvider>
    );
  })
);
