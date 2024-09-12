/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");
const filesize = require("rollup-plugin-filesize");

const sandpackClientPkg = require("../sandpack-client/package.json");

const pkg = require("./package.json");
const generateUnstyledTypes = require("./scripts/rollup-generate-unstyled-types");
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
          "process.env.SANDPACK_CLIENT_VERSION": `"${sandpackClientPkg.version}"`,
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
        banner: `"use client";\n`,
        preserveModules: false,
      },
      {
        dir: "dist",
        chunkFileNames: "[name]-[hash].mjs",
        entryFileNames: "[name].mjs",
        exports: "named",
        format: "es",
        inlineDynamicImports: true,
        banner: `"use client";\n`,
        preserveModules: false,
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
      generateUnstyledTypes(),
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
