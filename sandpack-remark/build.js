/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const { build } = require("esbuild");

const package = require("../sandpack-themes/package.json");

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
};

build({
  ...options,
  format: "esm",
  outdir: "dist/esm",
  target: "es2019",
  platform:'node',
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

build({
  ...options,
  format: "cjs",
  outdir: "dist/cjs",
  target: "es6",
  platform:'node',
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
