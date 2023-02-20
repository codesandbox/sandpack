/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const {
  NodeGlobalsPolyfillPlugin,
} = require("@esbuild-plugins/node-globals-polyfill");
const { build } = require("esbuild");

const package = require("./package.json");

async function buildInjectScripts() {
  const result = await build({
    entryPoints: ["src/clients/node/inject-scripts/consoleHook.ts"],
    bundle: true,
    write: false,
    sourcemap: false,
    external: [],
    minify: true,
    format: "cjs",
    target: "es6",
  });

  const text = result.outputFiles[0].text;

  const dist = "src/clients/node/inject-scripts/dist/";

  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  fs.writeFile(`${dist}/consoleHook.txt`, text, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}

async function bundle() {
  const options = {
    entryPoints: [
      ...fs
        .readdirSync("./src")
        .filter((src) => src.endsWith(".ts"))
        .map((e) => `src/${e}`),
      "src/clients/node/index.ts",
      "src/clients/runtime/index.ts",
    ],
    outdir: "./dist",
    define: {
      global: "globalThis",
      "process.env.CODESANDBOX_ENV": `"${process.env.CODESANDBOX_ENV}"`,
      "process.env.PACKAGE_VERSION": `"${package.version}"`,
    },
    external: Object.keys({
      ...(package.dependencies || {}),
      ...(package.devDependencies || {}),
      ...(package.peerDependencies || {}),
    }),
    minify: false,
    bundle: true,
    sourcemap: true,
    plugins: [NodeGlobalsPolyfillPlugin({ process: false, buffer: true })],
  };

  await build({
    ...options,
    format: "cjs",
    target: "es6",
  });

  await build({
    ...options,
    format: "esm",
    outExtension: { ".js": ".mjs" },
    target: "es2019",
  });
}

(async function main() {
  await buildInjectScripts();
  await bundle();
})();
