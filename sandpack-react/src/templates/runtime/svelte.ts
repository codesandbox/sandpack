import { commonFiles } from "../common";

export const SVELTE_TEMPLATE = {
  files: {
    ...commonFiles,
    "/App.svelte": {
      code: `<style>
  h1 {
    font-size: 1.5rem;
  }
</style>

<script>
  let name = 'world';
</script>

<main>
  <h1>Hello {name}</h1>
</main>`,
    },
    "/index.js": {
      code: `import App from "./App.svelte";
import "./styles.css";

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
    "/package.json": {
      code: JSON.stringify({
        dependencies: {
          svelte: "^3.0.0",
        },
        main: "/index.js",
      }),
    },
  },
  main: "/App.svelte",
  environment: "svelte",
};
