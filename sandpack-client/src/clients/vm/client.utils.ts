import type { SandboxWithoutClient } from "@codesandbox/sdk/dist/esm/sandbox";

import { createError } from "../..";
import type { SandpackBundlerFiles } from "../../";

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

export const getMessageFromError = (error: Error | string): string => {
  if (typeof error === "string") return error;

  if (typeof error === "object" && "message" in error) {
    return error.message;
  }

  return createError(
    "The server could not be reached. Make sure that the node script is running and that a port has been started."
  );
};

export async function scanDirectory(
  dirPath: string,
  fs: SandboxWithoutClient["fs"]
) {
  const IGNORED_DIRS = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    "coverage",
    ".cache",
    ".next",
    ".nuxt",
    ".output",
    ".vscode",
    ".idea",
    ".devcontainer",
    ".codesandbox",
    "yarn.lock",
    "pnpm-lock.yaml",
  ]);

  const TYPES = {
    FILE: 0,
    FOLDER: 1,
  };

  const results: Array<{ path: string; content: Uint8Array }> = [];

  try {
    const entries = await fs.readdir(dirPath);

    for (const entry of entries) {
      const fullPath = dirPath + "/" + entry.name;

      if (entry.isSymlink || IGNORED_DIRS.has(entry.name)) {
        continue;
      }

      if (entry.type === TYPES.FILE) {
        results.push({
          path: fullPath,
          content: await fs.readFile(fullPath),
        });
      }

      // Recursively scan subdirectories
      if (entry.type === TYPES.FOLDER) {
        const subDirResults = await scanDirectory(fullPath, fs);
        results.push(...subDirResults);
      }
    }

    return results;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    throw error;
  }
}

let groupId = 1;
export const createLogGroup = (group: string) => {
  let logId = 1;

  // eslint-disable-next-line no-console
  console.group(`[${groupId++}]: ${group}`);

  return {
    // eslint-disable-next-line no-console
    groupEnd: () => console.groupEnd(),
    log: (...args: unknown[]): void => {
      // eslint-disable-next-line no-console
      console.debug(`[${logId++}]:`, ...args);
    },
  };
};

export const throwIfTimeout = (timeout: number) => {
  return new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error(`Timeout of ${timeout}ms exceeded`));
    }, timeout)
  );
};
