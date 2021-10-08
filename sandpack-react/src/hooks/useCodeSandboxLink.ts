import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { getParameters } from "codesandbox-import-utils/lib/api/define";
import * as React from "react";

import type { SandboxEnvironment } from "../types";

import { useSandpack } from "./useSandpack";

const getFileParameters = (
  files: SandpackBundlerFiles,
  environment?: SandboxEnvironment
) => {
  const normalized: Record<
    string,
    { content: string; isBinary: boolean }
  > = Object.keys(files).reduce(
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
