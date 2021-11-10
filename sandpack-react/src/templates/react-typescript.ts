import type { SandboxTemplate } from "../types";

export const REACT_TYPESCRIPT_TEMPLATE: SandboxTemplate = {
  files: {
    "tsconfig.json": {
      code: `{
    "include": [
        "./src/**/*"
    ],
    "compilerOptions": {
        "strict": true,
        "esModuleInterop": true,
        "lib": [
            "dom",
            "es2015"
        ],
        "jsx": "react-jsx"
    }
}`,
    },
    "/src/App.tsx": {
      code: `export default function App(): JSX.Element {
  return <h1>Hello World</h1>
}
`,
    },
    "/src/index.tsx": {
      code: `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`,
    },
    "/src/styles.css": {
      code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
  },
  dependencies: {
    react: "^17.0.0",
    "react-dom": "^17.0.0",
    "react-scripts": "^4.0.0",
  },
  devDependencies: {
    "@types/react": "^17.0.0",
    "@types/react-dom": "^17.0.0",
    typescript: "^4.0.0",
  },
  entry: "/src/index.tsx",
  main: "/src/App.tsx",
  environment: "create-react-app",
};
