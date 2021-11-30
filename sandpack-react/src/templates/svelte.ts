import type { SandboxTemplate } from "../types";

export const SVELTE_TEMPLATE: SandboxTemplate = {
  environment: "svelte",
  main: "/index.js",
  entry: "/index.js",

  files: {
    "/App.svelte": {
      code: `<style>
  main {
    font-family: sans-serif;
    text-align: center;
  }
</style>

<script>
  let name = 'world';
</script>

<main>
  <h1>Hello {name}!</h1>
</main>`,
    },
    "/index.js": {
      code: `import App from "./App.svelte";

const app = new App({
  target: document.body
});

export default app;
      `,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf8" />
    <meta name="viewport" content="width=device-width" />

    <title>Svelte app</title>

    <link rel="stylesheet" href="public/bundle.css" />
  </head>

  <body>
    <script src="bundle.js"></script>
  </body>
</html>`,
    },
  },
  dependencies: {
    svelte: "^3.0.0",
  },
};
