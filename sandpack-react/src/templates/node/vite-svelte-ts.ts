import { commonFiles } from "../common";

export const VITE_SVELTE_TS_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/App.svelte": {
      code: `<script lang="ts">
const data: string = "world";
</script>

<h1>Hello {data}</h1>

<style>
h1 {
  font-size: 1.5rem;
}
</style>`,
    },
    "/src/main.ts": {
      code: `import App from './App.svelte'
import "./styles.css"

const app = new App({
  target: document.getElementById('app'),
})

export default app`,
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
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
    },
    "/vite-env.d.ts": {
      code: `/// <reference types="svelte" />
/// <reference types="vite/client" />`,
    },
    "svelte.config.js": {
      code: `import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
`,
    },
    "/vite.config.ts": {
      code: `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
})`,
    },
    "tsconfig.json": {
      code: JSON.stringify(
        {
          extends: "@tsconfig/svelte/tsconfig.json",
          compilerOptions: {
            target: "ESNext",
            useDefineForClassFields: true,
            module: "ESNext",
            resolveJsonModule: true,
            allowJs: true,
            checkJs: true,
            isolatedModules: true,
          },
          include: [
            "src/**/*.d.ts",
            "src/**/*.ts",
            "src/**/*.js",
            "src/**/*.svelte",
          ],
          references: [{ path: "./tsconfig.node.json" }],
        },
        null,
        2
      ),
    },
    "tsconfig.node.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            module: "ESNext",
            moduleResolution: "Node",
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
          type: "module",
          scripts: {
            dev: "vite",
          },
          devDependencies: {
            "@sveltejs/vite-plugin-svelte": "^2.0.2",
            "@tsconfig/svelte": "^3.0.0",
            svelte: "^3.55.1",
            "svelte-check": "^2.10.3",
            tslib: "^2.5.0",
            vite: "4.1.4",
            "esbuild-wasm": "^0.17.12",
          },
        },
        null,
        2
      ),
    },
  },
  main: "/src/App.svelte",
  environment: "node",
};
