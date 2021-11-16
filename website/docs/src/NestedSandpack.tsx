import { Sandpack } from "./CustomSandpack";
import React from "react";

const indexCode = `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "@codesandbox/sandpack-react/dist/index.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`;

const NestedSandpack: React.FC<{ nestedProps?: string }> = (props) => {
    const { nestedProps } = props;
    const appCode = `import {Sandpack} from "@codesandbox/sandpack-react";

export default function App() {
  return <Sandpack 
    ${nestedProps ? nestedProps : '// theme="codesandbox-dark"'}
  />
}
`;
    return (
        <Sandpack
            template="react"
            files={{
                "/App.js": appCode,
                "/index.js": {
                    code: indexCode,
                    hidden: true,
                },
            }}
            options={{
                editorHeight: 500,
            }}
            customSetup={{
                dependencies: {
                    "@codesandbox/sandpack-react": "^0.3.3",
                },
            }}
            {...props}
        />
    );
};

export { NestedSandpack };
