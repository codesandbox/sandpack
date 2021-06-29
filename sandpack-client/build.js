const fs = require("fs");
const package = require("./package.json");
const { build } = require("esbuild");

const options = {
  entryPoints: fs
    .readdirSync("./src")
    .filter((src) => src.endsWith(".ts"))
    .map((e) => `src/${e}`),

  bundle: true,
  sourcemap: true,
  define: {
    "process.env.CODESANDBOX_ENV": `"${process.env.CODESANDBOX_ENV}"`,
    "process.env.PACKAGE_VERSION": `"${package.version}"`,
  },
};

build({
  ...options,
  format: "esm",
  splitting: true,
  outdir: "dist/esm",
  target: "es2019",
}).catch(() => process.exit(1));
build({
  ...options,
  format: "cjs",
  outdir: "dist/cjs",
}).catch(() => process.exit(1));
