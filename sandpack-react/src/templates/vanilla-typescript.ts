/**
 * @hidden
 */
export const VANILLA_TYPESCRIPT_TEMPLATE = {
  files: {
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
    "/src/index.ts": {
      code: `import "./styles.css";

document.getElementById("app").innerHTML = \`
<h1>Hello World</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
\`;
`,
    },
    "/src/styles.css": {
      code: `body {
  font-family: sans-serif;
}
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

  <script src="src/index.ts">
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
        main: "/src/index.ts",
      }),
    },
  },
  main: "/src/index.ts",
  environment: "parcel",
};
