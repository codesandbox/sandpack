import { commonFiles } from "../common";

export const VITE_PREACT_TS_TEMPLATE = {
  files: {
    ...commonFiles,
    "/App.tsx": {
      code: `export default function App() {
  const data: string = "world"

  return <h1>Hello {data}</h1>
}
`,
    },
    "/index.tsx": {
      code: `import { render } from "preact";
import "./styles.css";

import App from "./App";

const root = document.getElementById("root") as HTMLElement;
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
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
`,
    },
    "/tsconfig.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            target: "ESNext",
            useDefineForClassFields: true,
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            allowJs: false,
            skipLibCheck: true,
            esModuleInterop: false,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "ESNext",
            moduleResolution: "Node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
            jsxImportSource: "preact",
          },
          include: ["src"],
          references: [{ path: "./tsconfig.node.json" }],
        },
        null,
        2
      ),
    },
    "/tsconfig.node.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            module: "ESNext",
            moduleResolution: "Node",
            allowSyntheticDefaultImports: true,
          },
          include: ["vite.config.ts"],
        },
        null,
        2
      ),
    },
    "/package.json": {
      code: JSON.stringify(
        {
          scripts: {
            dev: "vite",
            build: "tsc && vite build",
            preview: "vite preview",
          },
          dependencies: {
            preact: "^10.16.0",
          },
          devDependencies: {
            "@preact/preset-vite": "^2.5.0",
            typescript: "^4.9.5",
            vite: "4.1.4",
            "esbuild-wasm": "^0.17.12",
          },
        },
        null,
        2
      ),
    },
    "/vite-env.d.ts": {
      code: '/// <reference types="vite/client" />',
    },
    "/vite.config.ts": {
      code: `import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
})
`,
    },
  },
  main: "/App.tsx",
  environment: "node",
};
