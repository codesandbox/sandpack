'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonjs = require('@rollup/plugin-commonjs');
var pluginNodeResolve = require('@rollup/plugin-node-resolve');
var replace = require('@rollup/plugin-replace');
var terser = require('@rollup/plugin-terser');
var typescript = require('@rollup/plugin-typescript');
var rollupPluginString = require('rollup-plugin-string');
var pkg = require('./package.json');

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
      pluginNodeResolve.nodeResolve(),
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
      rollupPluginString.string({ include: "**/dist/consoleHook.js" }),
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

exports.default = configs;
