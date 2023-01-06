const typescript = require("@rollup/plugin-typescript");
const pkg = require("./package.json");
const commonjs = require("@rollup/plugin-commonjs");

const replace = require("rollup-plugin-replace");

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
    replace({ "process.env.TEST_ENV": "false" }),
    commonjs({ requireReturnsDefault: "preferred" }),
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
};

module.exports = configBase;
