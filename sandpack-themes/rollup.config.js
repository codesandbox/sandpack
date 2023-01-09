const typescript = require("@rollup/plugin-typescript");
const pkg = require("./package.json");
const commonjs = require("@rollup/plugin-commonjs");

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

  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs({ requireReturnsDefault: "preferred" }),
  ],
  external: [...Object.keys(pkg.devDependencies)],
};

module.exports = configBase;
