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
          "App.js": `import { Button } from "@codesandbox/test-package";

export default function App() {
  return <Button>Hello World</Button>
}`,
        }}
        teamId="642af90c-4717-4730-bad3-e4c1e37ca5e2"
        template="react"
      />
    </div>
  );
};
