import type { ShellCommandOptions } from "@codesandbox/nodebox/build/modules/shell";
import { invariant } from "outvariant";

import type { SandpackBundlerFiles } from "../..";
import { createError } from "../..";

export const writeBuffer = (
  content: string | Uint8Array,
  encoding: BufferEncoding = "utf8"
): Uint8Array => {
  if (typeof content === "string") {
    return Buffer.from(content, encoding);
  } else {
    return content;
  }
};

export const readBuffer = (content: string | Uint8Array): string => {
  if (typeof content === "string") return content;

  return Buffer.from(content).toString("utf-8");
};

export const fromBundlerFilesToFS = (
  files: SandpackBundlerFiles
): Record<string, Uint8Array> => {
  return Object.entries(files).reduce<Record<string, Uint8Array>>(
    (acc, [key, value]) => {
      acc[key] = writeBuffer(value.code);

      return acc;
    },
    {}
  );
};

/**
 * Figure out which script it must run to start a server
 */
export const findStartScriptPackageJson = (
  packageJson: string
): [string, string[], ShellCommandOptions] => {
  let scripts: Record<string, string> = {};
  const possibleKeys = ["dev", "start"];

  try {
    scripts = JSON.parse(packageJson).scripts;
  } catch (e) {
    throw createError(
      "Could not parse package.json file: " + (e as Error).message
    );
  }

  invariant(
    scripts,
    "Failed to start. Please provide a `start` or `dev` script on the package.json"
  );

  for (let index = 0; index < possibleKeys.length; index++) {
    if (possibleKeys[index] in scripts) {
      const script = possibleKeys[index];

      const candidate = scripts[script];

      const env = candidate
        .match(/(\w+=\w+;)*\w+=\w+/g)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.reduce<any>((acc, curr) => {
          const [key, value] = curr.split("=");
          acc[key] = value;
          return acc;
        }, {});

      const [command, ...args] = candidate
        .replace(/(\w+=\w+;)*\w+=\w+/g, "")
        .trim()
        .split(" ");

      return [command, args, { env }];
    }
  }

  throw createError(
    "Failed to start. Please provide a `start` or `dev` script on the package.json"
  );
};

export const getMessageFromError = (error: Error | string): string => {
  if (typeof error === "string") return error;

  if (typeof error === "object" && "message" in error) {
    return error.message;
  }

  return createError(
    "The server could not be reached. Make sure that the node script is running and that a port has been started."
  );
};
