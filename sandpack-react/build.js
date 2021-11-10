/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const { build } = require("esbuild");
const package = require("./package.json");
const args = process.argv.slice(2);

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

const watchConfig = {
  onRebuild(error) {
    if (error) console.error("rebuild failed");
    else console.log("rebuild succeeded");
  },
};

build({
  ...options,
  format: "esm",
  outdir: "dist/esm",
  target: "es2019",
  watch: args.includes("--watch") ? watchConfig : false,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});

build({
  ...options,
  format: "cjs",
  outdir: "dist/cjs",
  target: "es6",
  watch: args.includes("--watch") ? watchConfig : false,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
