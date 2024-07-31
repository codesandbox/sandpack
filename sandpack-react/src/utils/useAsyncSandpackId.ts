import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { useId as useReactId } from "react";

import { generateRandomId } from "./stringUtils";

/**
 * This is a hard constraint to make URLs shorter.
 * For example, this id will be used to mount SW in the iframe
 * so, to keep the URL valid, this must be an 9 character long string
 */
const MAX_ID_LENGTH = 9;

export const useAsyncSandpackId = (files: SandpackBundlerFiles) => {
  if (typeof useReactId === "function") {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const id = useReactId();
    return async () => {
      const allCode = Object.entries(files)
        .map((path, code) => path + "|" + code)
        .join("|||");
      const sha = await generateShortId(allCode + id);

      return ensureLength(sha.replace(/:/g, "sp"), MAX_ID_LENGTH);
    };
  } else {
    return generateRandomId();
  }
};

function ensureLength(str: string, length: number) {
  if (str.length > length) {
    return str.slice(0, length);
  } else {
    return str.padEnd(length, "s");
  }
}

async function generateShortId(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return btoa(String.fromCharCode(...hashArray));
}
