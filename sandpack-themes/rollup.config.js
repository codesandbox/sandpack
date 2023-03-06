/* eslint-disable @typescript-eslint/no-var-requires */
const typescript = require("@rollup/plugin-typescript");

const pkg = require("./package.json");

const configBase = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      exports: "named",
      format: "cjs",
      inlineDynamicImports: true,
      interop: "auto",
    },
    {
      file: pkg.module,
      exports: "named",
      format: "es",
      inlineDynamicImports: true,
    },
  ],

  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  external: [...Object.keys(pkg.devDependencies)],
};

module.exports = configBase;
