/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");

const pkg = require("./package.json");

const styleless = process.env.SANDPACK_BARE_COMPONENTS === "true";

const configBase = {
  input: "src/index.ts",
  output: [
    {
      file: styleless
        ? pkg.main.replace("index.js", "index.styless.js")
        : pkg.main,
      exports: "named",
      format: "cjs",
      inlineDynamicImports: true,
      interop: "auto",
    },
    {
      file: styleless
        ? pkg.module.replace("index.js", "index.styless.js")
        : pkg.module,
      exports: "named",
      format: "es",
      inlineDynamicImports: true,
    },
  ],

  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.TEST_ENV": "false",
        "process.env.SANDPACK_BARE_COMPONENTS": `"${styleless}"`,
      },
    }),
    commonjs({ requireReturnsDefault: "preferred" }),
  ],
  external: [
    "react/jsx-runtime",
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
};

module.exports = configBase;
