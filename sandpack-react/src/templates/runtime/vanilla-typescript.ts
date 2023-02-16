import { commonFiles } from "../common";

export const VANILLA_TYPESCRIPT_TEMPLATE = {
  files: {
    ...commonFiles,
    "tsconfig.json": {
      code: `{
  "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "jsx": "preserve",
    "esModuleInterop": true,
    "sourceMap": true,
    "allowJs": true,
    "lib": [
      "es6",
      "dom"
    ],
    "rootDir": "src",
    "moduleResolution": "node"
  }
}`,
    },
    "/index.ts": {
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

  <script src="index.ts">
  </script>
</body>

</html>`,
    },
    "/package.json": {
      code: JSON.stringify({
        dependencies: {},
        devDependencies: {
          typescript: "^4.0.0",
        },
        main: "/index.ts",
      }),
    },
  },
  main: "/index.ts",
  environment: "parcel",
};
