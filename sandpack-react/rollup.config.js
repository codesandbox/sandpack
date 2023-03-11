/* eslint-disable @typescript-eslint/no-var-requires */
import { relative } from "path";

import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";

const configBase = {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      entryFileNames: relative("dist", pkg.main),
      exports: "named",
      format: "cjs",
      interop: "auto",
    },
    {
      dir: "dist",
      entryFileNames: relative("dist", pkg.module),
      exports: "named",
      format: "es",
    },
  ],

  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    replace({
      preventAssignment: true,
      values: { "process.env.TEST_ENV": "false" },
    }),
    commonjs({ requireReturnsDefault: "preferred" }),
  ],
  external: [
    "react/jsx-runtime",
    /react-devtools-inline/,
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
};

export default configBase;
