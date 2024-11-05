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
