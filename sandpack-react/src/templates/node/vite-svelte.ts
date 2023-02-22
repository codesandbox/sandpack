import { commonFiles } from "../common";

export const VITE_SVELTE_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/App.svelte": {
      code: `<script>
const data = "world";
</script>

<h1>Hello {data}</h1>

<style>
h1 {
  font-size: 1.5rem;
}
</style>`,
    },
    "/src/main.js": {
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
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
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
    "/vite.config.js": {
      code: `import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
})`,
    },

    "/package.json": {
      code: JSON.stringify({
        type: "module",
        scripts: {
          dev: "vite",
        },
        dependencies: {
          svelte: "^3.55.1",
        },
        devDependencies: {
          "@sveltejs/vite-plugin-svelte": "^2.0.2",
          vite: "^4.1.4",
          "esbuild-wasm": "0.17.10",
        },
      }),
    },
  },
  main: "/src/App.svelte",
  environment: "node",
};
