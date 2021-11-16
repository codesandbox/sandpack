import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const baseConfig = {
  input: "./src/index.ts",
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [typescript({ emitDeclarationOnly: false }), nodeResolve()],
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
      preserveModules: true,
    },
  },
  {
    ...baseConfig,
    output: {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].[format].js",
      preserveModules: true,
    },
  },
];
