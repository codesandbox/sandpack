import React from "react";

import { Sandpack } from "./CustomSandpack";

const indexCode = `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`;

const NestedSandpack: React.FC<{ nestedProps?: string; setupCode?: string }> = (
  props
) => {
  const { nestedProps, setupCode } = props;
  const appCode = `${
    setupCode
      ? setupCode
      : `import { Sandpack } from "@codesandbox/sandpack-react";`
  }

export default function App() {
  return (
    <Sandpack 
  ${
    nestedProps
      ? nestedProps
      : `    // You can change these examples!
      // Try uncommenting any of these lines
      // theme="dark"
      // template="react"`
  }
    />
  );
}
`;
  return (
    <div className="nestedSandpack">
      <Sandpack
        customSetup={{
          dependencies: {
            "@codesandbox/sandpack-react": "latest",
            "@codesandbox/sandpack-themes": "latest",
          },
        }}
        files={{
          "/App.js": appCode,
          "/index.js": {
            code: indexCode,
            hidden: true,
          },
        }}
        template="react"
        {...props}
      />
    </div>
  );
};

export { NestedSandpack };
