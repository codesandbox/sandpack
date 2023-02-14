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
          npmRegistries: [
            {
              enabledScopes: ["@codesandbox"],
              codesandboxTeamId: `lg1lqh`,
            },
          ],
        }}
        options={{ bundlerURL: `http://localhost:3000` }}
        template="react"
        files={{
          "App.js": `import { Button } from "@codesandbox/test-package";
        
export default function App() {
  return <Button>Hello World</Button>
}`,
        }}
      />
    </div>
  );
};
