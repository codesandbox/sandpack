import { commonFiles } from "../common";

export const REACT_TYPESCRIPT_TEMPLATE = {
  files: {
    ...commonFiles,
    "tsconfig.json": {
      code: `{
  "include": [
    "./**/*"
  ],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": [ "dom", "es2015" ],
    "jsx": "react-jsx"
  }
}`,
    },
    "/App.tsx": {
      code: `export default function App(): JSX.Element {
  return <h1>Hello world</h1>
}
`,
    },
    "/index.tsx": {
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
          "react-scripts": "^4.0.0",
        },
        devDependencies: {
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          typescript: "^4.0.0",
        },
        main: "/index.tsx",
      }),
    },
  },
  main: "/App.tsx",
  environment: "create-react-app",
};
