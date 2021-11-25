import type { SandboxTemplate } from "../types";

export const SVELTE_TEMPLATE: SandboxTemplate = {
  environment: "svelte",
  main: "/index.js",
  entry: "/index.js",

  files: {
    "/App.svelte": {
      code: "<style>\n  main {\n    font-family: sans-serif;\n    text-align: center;\n  }\n</style>\n\n<main>\n\t<h1>Hello CodeSandbox</h1>\n\t<h2>Start editing to see some magic happen!</h2>\n</main>",
    },
    "/index.js": {
      code: 'import App from "./App.svelte";\n\nconst app = new App({\n  target: document.body\n});\n\nexport default app;\n',
    },
    "/public/index.html": {
      code: '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf8" />\n    <meta name="viewport" content="width=device-width" />\n\n    <title>Svelte app</title>\n\n    <link rel="stylesheet" href="public/bundle.css" />\n  </head>\n\n  <body>\n    <script src="bundle.js"></script>\n  </body>\n</html>\n',
    },
  },
  dependencies: {
    svelte: "^3.0.0",
  },
};
