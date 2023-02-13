import React from "react";

import { Sandpack } from "./presets";

export default {
  title: "Intro/PrivatePackage",
};

const bundlerURL = `http://localhost:3000`;
const teamSandboxId = `lg1lqh`;

export const Basic: React.FC = () => {
  return (
    <Sandpack
      customSetup={{
        dependencies: { "@codesandbox/test-package": "latest" },
        npmRegistries: [
          {
            enabledScopes: ["@codesandbox"],
            limitToScopes: true,
            proxyEnabled: true,
            registryUrl: `https://5t0o8w-3000.preview.csb.app/api/v1/sandboxes/${teamSandboxId}/npm_registry`,
          },
        ],
      }}
      files={{
        "App.js": `import { Button } from "@codesandbox/test-package";
        
export default function App() {
  return <Button>Hello World</Button>
}`,
      }}
      options={{ bundlerURL }}
      template="react"
    />
  );
};
