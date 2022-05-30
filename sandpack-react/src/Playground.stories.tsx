import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

const defaultFiles = {
  "/index.js": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  "/package.json": `{
  "name": "test-sandbox",
  "main": "/index.js",
  "private": true,
  "scripts": {},
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^4.0.0"
  }
}
`,
};

const filesA = {
  "/App.js": `export default function App() {
  return <h1>File A</h1>
}`,
};

const filesB = {
  "/App.js": `export default function App() {
  return <h1>File B</h1>
}`,
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack
        customSetup={{
          environment: "create-react-app",
          entry: "/index.js",
        }}
        files={defaultFiles}
        options={{
          bundlerURL: "http://localhost:1234",
          fileResolver: {
            isFile: async (fileName): any =>
              new Promise((resolve) => resolve(!!filesA[fileName])),
            readFile: async (fileName): any =>
              new Promise((resolve) => resolve(filesA[fileName])),
          },
        }}
      />

      <Sandpack
        customSetup={{
          environment: "create-react-app",
          entry: "/index.js",
        }}
        files={defaultFiles}
        options={{
          bundlerURL: "http://localhost:1234",
          fileResolver: {
            isFile: async (fileName): any =>
              new Promise((resolve) => resolve(!!filesB[fileName])),
            readFile: async (fileName): any =>
              new Promise((resolve) => resolve(filesB[fileName])),
          },
        }}
      />
    </>
  );
};
