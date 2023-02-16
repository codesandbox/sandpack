import { commonFiles } from "../common";

export const VANILLA_TEMPLATE = {
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
<html>

<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
</head>

<body>
  <div id="app"></div>

  <script src="index.js">
  </script>
</body>

</html>`,
    },
    "/package.json": {
      code: JSON.stringify({
        dependencies: {},
        main: "/index.js",
      }),
    },
  },
  main: "/index.js",
  environment: "parcel",
};
