import type { ShellCommandOptions } from "@codesandbox/nodebox/build/modules/shell";
import { invariant } from "outvariant";

import type { SandpackBundlerFiles } from "../..";
import { createError } from "../..";

import { tokenize, TokenType } from "./taskManager";

let counter = 0;

export function generateRandomId() {
  const now = Date.now();
  const randomNumber = Math.round(Math.random() * 10000);
  const count = (counter += 1);
  return (+`${now}${randomNumber}${count}`).toString(16);
}

export const writeBuffer = (content: string | Uint8Array): Uint8Array => {
  if (typeof content === "string") {
    return new TextEncoder().encode(content);
  } else {
    return content;
  }
};

export const readBuffer = (content: string | Uint8Array): string => {
  if (typeof content === "string") {
    return content;
  } else {
    return new TextDecoder().decode(content);
  }
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
  // TODO: support postinstall
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

      let env = {};
      let command = "";
      const args: string[] = [];

      tokenize(candidate).forEach((item) => {
        const commandNotFoundYet = command === "";

        if (item.type === TokenType.EnvVar) {
          env = item.value;
        }

        if (item.type === TokenType.Command && commandNotFoundYet) {
          command = item.value!;
        }

        if (
          item.type === TokenType.Argument ||
          (!commandNotFoundYet && item.type === TokenType.Command)
        ) {
          args.push(item.value!);
        }

        // TODO: support TokenType.AND, TokenType.OR, TokenType.PIPE
      });

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
