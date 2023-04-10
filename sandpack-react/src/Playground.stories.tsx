/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./";

export const Basic: React.FC = () => {
  return (
    <Sandpack
      options={{ classes: { "sp-layout": "fooo" } }}
      template="nextjs"
      theme={themes.sandpackDark}
    />
  );
};

export const EslintBasic = () => (
  <Sandpack
    files={{
      "/.eslintrc.js": `module.exports = {
  rules: { 
    "no-unused-vars": "error",
    "no-console": "error",
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
}`,
      "/index.js": `const helloWorld = "";

console.log("foo");`,

      "/package.json": JSON.stringify({
        devDependencies: {
          eslint: "^8.0.1",
        },
        scripts: { start: "eslint index.js" },
      }),
    }}
    options={{
      visibleFiles: ["/index.js", "/.eslintrc.js"],
      showConsole: true,
    }}
    template="node"
  />
);
