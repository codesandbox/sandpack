/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const { build } = require("esbuild");
const package = require("./package.json");

const options = {
  entryPoints: fs
    .readdirSync("./src")
    .filter((src) => src.endsWith(".ts"))
    .map((e) => `src/${e}`),

  bundle: true,
  sourcemap: true,
  external: Object.keys({
    ...(package.dependencies || {}),
    ...(package.devDependencies || {}),
    ...(package.peerDependencies || {}),
  }),
  define: { "process.env.TEST_ENV": "false" },
  minify: true,
};

build({
  ...options,
  format: "esm",
  outdir: "dist/esm",
  target: "es2019",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

build({
  ...options,
  format: "cjs",
  outdir: "dist/cjs",
  target: "es6",
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
