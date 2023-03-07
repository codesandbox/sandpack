/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");

const pkg = require("./package.json");

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
      typescript({ tsconfig: "./tsconfig.json" })
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
        chunkFileNames: "[name]-[hash].mjs",
        entryFileNames: "[name].mjs",
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
      })
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
        chunkFileNames: "[name]-[hash].mjs",
        entryFileNames: "[name].mjs",
        exports: "named",
        format: "es",
        inlineDynamicImports: true,
      },
    ],
  },
];

module.exports = configBase;
