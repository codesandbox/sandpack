import { commonFiles } from "../common";

export const VITE_TEMPLATE = {
  files: {
    ...commonFiles,
    "/index.js": {
      code: `import "./styles.css";

document.getElementById("app").innerHTML = \`
<h1>Hello world</h1>
\`;
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
    <div id="app"></div>
    <script type="module" src="/index.js"></script>
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
        devDependencies: {
          vite: "4.1.4",
          "esbuild-wasm": "0.17.12",
        },
      }),
    },
  },
  main: "/index.js",
  environment: "node",
};
