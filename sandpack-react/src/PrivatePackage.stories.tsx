import React from "react";

import { Sandpack } from "./presets";

export default {
  title: "Intro/PrivatePackage",
};

export const Basic: React.FC = () => {
  return (
    <div style={{ width: 800, margin: "auto" }}>
      <pre>
        {`<Sandpack
  customSetup={{
    dependencies: { "@codesandbox/test-package": "latest" },
  }}
  files={{
    "App.js": \`import { Button } from "@codesandbox/test-package";

export default function App() {
return <Button>Hello World</Button>
}\`,
  }}
  options={{ bundlerURL: \`http://localhost:3000\` }}
  teamId="lg1lqh"
  template="react"
/>`}
      </pre>
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
        teamId="59dc0ba8-67d8-4eb3-8fbe-44e5b72a955e"
        template="react"
      />
    </div>
  );
};
