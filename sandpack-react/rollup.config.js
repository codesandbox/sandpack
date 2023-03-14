/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");
const filesize = require("rollup-plugin-filesize");

const pkg = require("./package.json");
const removeCss = require("./scripts/rollup-remove-css-transformer");

const basePlugins = [commonjs({ requireReturnsDefault: "preferred" })];

const external = [
  "react/jsx-runtime",
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(pkg.peerDependencies),
];

const baseConfig = { input: "src/index.ts", external };

const configBase = [
  {
    ...baseConfig,
    plugins: basePlugins.concat(
      replace({
        preventAssignment: true,
        values: {
          "process.env.TEST_ENV": "false",
          "process.env.SANDPACK_UNSTYLED_COMPONENTS": `"false"`,
        },
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      filesize()
    ),
    output: [
      {
        dir: "dist",
        exports: "named",
        format: "cjs",
        inlineDynamicImports: true,
        interop: "auto",
      },
      {
        dir: "dist",
        chunkFileNames: "[name]-[hash].esm.js",
        entryFileNames: "[name].esm.js",
        exports: "named",
        format: "es",
        inlineDynamicImports: true,
      },
    ],
  },

  {
    ...baseConfig,
    treeshake: {
      preset: "smallest",
      manualPureFunctions: ["createStitches"],
    },
    plugins: basePlugins.concat(
      replace({
        preventAssignment: true,
        values: {
          "process.env.TEST_ENV": "false",
          "process.env.SANDPACK_UNSTYLED_COMPONENTS": `"true"`,
        },
      }),
      typescript({
        tsconfig: "./tsconfig.json",
        compilerOptions: { outDir: "dist/unstyled/" },
      }),
      removeCss(),
      filesize()
    ),
    output: [
      {
        dir: "dist/unstyled",
        exports: "named",
        format: "cjs",
        inlineDynamicImports: true,
        interop: "auto",
      },
      {
        dir: "dist/unstyled",
        chunkFileNames: "[name]-[hash].esm.js",
        entryFileNames: "[name].esm.js",
        exports: "named",
        format: "es",
        inlineDynamicImports: true,
      },
    ],
  },
];

module.exports = configBase;
