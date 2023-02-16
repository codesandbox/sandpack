import { defineConfig } from "tsup";

import tsconfig from "./tsconfig.json";

export default defineConfig({
  name: "codesandbox-theme-docs",
  entry: ["src/index.tsx"],
  format: "esm",
  dts: true,
  outExtension: () => ({ js: ".js" }),
  target: tsconfig.compilerOptions.target,
});
