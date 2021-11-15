import { promises as fs } from "fs";

import { build } from "esbuild";
import glob from "glob";

const buildProject = async () => {
  const packageJson = JSON.parse(await fs.readFile("./package.json"));

  const getFiles = () =>
    new Promise((resolve) => {
      glob("./src/**/*.ts[x]", {}, (err, files) => {
        resolve(["./src/index.ts", ...files]);
      });
    });

  const config = {
    entryPoints: await getFiles(),
    entryNames: "[dir]/[name]",
    outbase: "src",
    bundle: true,
    sourcemap: true,
    external: Object.keys({
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
      ...(packageJson.peerDependencies || {}),
    }),
    outdir: "dist",
    target: "es2019",
  };

  build({
    ...config,
    format: "esm",
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });

    build({
      ...config,
      entryNames: "[dir]/[name].cjs",
      format: "cjs",
    }).catch((error) => {
      console.error(error);
      process.exit(1);
  });
};

buildProject();
