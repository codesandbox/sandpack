import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import LZString from "lz-string";
import * as React from "react";

import type { SandboxEnvironment } from "../types";

import { useSandpack } from "./useSandpack";

function compress(input:string) {
  return LZString.compressToBase64(input)
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, ""); // Remove ending '='
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getParameters(parameters: Record<string, any>) {
  return compress(JSON.stringify(parameters));
}

const getFileParameters = (
  files: SandpackBundlerFiles,
  environment?: SandboxEnvironment
) => {
  const normalized: Record<string, { content: string; isBinary: boolean }> =
    Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace("/", "")]: {
          content: files[next].code,
          isBinary: false,
        },
      }),
      {}
    );

  return getParameters({
    files: normalized,
    ...(environment ? { template: environment } : null),
  });
};

export const useCodeSandboxLink = (): string => {
  const { sandpack } = useSandpack();
  const params = getFileParameters(sandpack.files, sandpack.environment);

  // Register the usage of the codesandbox link
  React.useEffect(() => {
    sandpack.openInCSBRegisteredRef.current = true;
  }, []);

  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${params}&query=file=${sandpack.activePath}%26from-sandpack=true`;
};
