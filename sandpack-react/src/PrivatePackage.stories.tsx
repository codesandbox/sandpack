import React from "react";

import { Sandpack } from "./presets";

export default {
  title: "Intro/PrivatePackage",
};

export const Basic: React.FC = () => {
  return (
    <div style={{ width: 800, margin: "auto" }}>
      <Sandpack
        customSetup={{
          dependencies: { "@codesandbox/test-package": "latest" },
        }}
        files={{
          "/public/logo.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">
          <title>React Logo</title>
          <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
          <g stroke="#61dafb" stroke-width="1" fill="none">
            <ellipse rx="11" ry="4.2"/>
            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
          </g>
        </svg>
          `,
          "App.js": `import { Button } from "@codesandbox/test-package";

export default function App() {
  return <>
    <Button>Hello World</Button>
    <img width="100" src="/public/logo.svg" />
  </>
}`,
        }}
        options={{
          experimental_enableServiceWorker: true,
          experimental_enableStableServiceWorkerId: true,
        }}
        teamId="642af90c-4717-4730-bad3-e4c1e37ca5e2"
        template="react"
      />
    </div>
  );
};
