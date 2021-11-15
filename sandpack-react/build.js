/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require("esbuild");
const glob = require("glob");

const package = require("./package.json");

const buildProject = async () => {
  const getFiles = () =>
    new Promise((resolve) => {
      glob("./src/**/index.ts[x]", {}, (err, files) => {
        resolve(["./src/index.ts", ...files]);
      });
    });

  build({
    entryPoints: await getFiles(),
    entryNames: "[dir]/[name]",
    outbase: "src",
    bundle: true,
    sourcemap: true,
    external: Object.keys({
      ...(package.dependencies || {}),
      ...(package.devDependencies || {}),
      ...(package.peerDependencies || {}),
    }),
    format: "esm",
    outdir: "dist",
    target: "es2019",
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};

buildProject();
