import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";


import pkg from "./package.json";

const baseConfig = {
  input: "./src/index.ts",
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({ emitDeclarationOnly: false }),
    nodeResolve(),
    replace({
      "process.env.CODESANDBOX_ENV": `"${process.env.CODESANDBOX_ENV}"`,
      "process.env.PACKAGE_VERSION": `"${pkg.version}"`,
    }),
  ],
};

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    ...baseConfig,
    output: {
      dir: "dist",
      format: "es",
      sourcemap: true,
    },
  },
  {
    ...baseConfig,
    output: {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].[format].js",
    },
  },
];
