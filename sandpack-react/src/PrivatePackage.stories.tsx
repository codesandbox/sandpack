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
        options={{ bundlerURL: `http://localhost:3000` }}
        // options={{ bundlerURL: `https://2-1-0-sandpack.codesandbox.stream/` }}
        teamId="6756547b-12fb-465e-82c8-b38a981f1f67"
        template="react"
      />
    </div>
  );
};
