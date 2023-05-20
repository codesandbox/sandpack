import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { string } from "rollup-plugin-string";

import pkg from "./package.json";

const configs = [
  {
    input: "src/inject-scripts/consoleHook.ts",
    output: {
      file: "src/inject-scripts/dist/consoleHook.js",
      format: "es",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        compilerOptions: { declaration: false },
      }),
      commonjs(),
      nodeResolve(),
      terser({ compress: { passes: 2 } }),
    ],
    external: [],
  },

  {
    input: {
      index: "src/index.ts",
      "clients/node/index": "src/clients/node/index.ts",
      "clients/runtime/index": "src/clients/runtime/index.ts",
    },
    output: [
      {
        dir: "dist",
        format: "cjs",
      },
      {
        dir: "dist",
        chunkFileNames: "[name]-[hash].mjs",
        entryFileNames: "[name].mjs",
        format: "es",
      },
    ],

    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      string({ include: "**/dist/consoleHook.js" }),
      replace({
        preventAssignment: true,
        values: {
          global: "globalThis",
          "process.env.CODESANDBOX_ENV": `"${process.env.CODESANDBOX_ENV}"`,
          "process.env.PACKAGE_VERSION": `"${pkg.version}"`,
        },
      }),
    ],
    external: Object.keys({
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
    }),
  },
];

export default configs;
