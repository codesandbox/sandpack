import { commonFiles } from "../common";

export const VITE_PREACT_TEMPLATE = {
  files: {
    ...commonFiles,
    "/App.jsx": {
      code: `export default function App() {
  const data = "world"

  return <h1>Hello {data}</h1>
}
`,
    },
    "/index.jsx": {
      code: `import { render } from "preact";
import "./styles.css";

import App from "./App";

const root = document.getElementById("root");
render(<App />, root);
`,
    },
    "/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
  </body>
</html>
`,
    },
    "/package.json": {
      code: JSON.stringify({
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          preact: "^10.16.0",
        },
        devDependencies: {
          "@preact/preset-vite": "^2.5.0",
          vite: "4.1.4",
          "esbuild-wasm": "0.17.12",
        },
      }),
    },
    "/vite.config.js": {
      code: `import { defineConfig } from "vite";
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
});
`,
    },
  },
  main: "/App.jsx",
  environment: "node",
};
