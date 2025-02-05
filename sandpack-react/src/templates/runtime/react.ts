import { commonFiles } from "../common";

export const REACT_TEMPLATE = {
  files: {
    ...commonFiles,
    "/App.js": {
      code: `export default function App() {
  return <h1>Hello world</h1>
}
`,
    },
    "/index.js": {
      code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
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
    "/package.json": {
      code: JSON.stringify({
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "react-scripts": "^5.0.0",
        },
        main: "/index.js",
      }),
    },
  },
  main: "/App.js",
  environment: "create-react-app",
};
