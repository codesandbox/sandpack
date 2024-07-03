import mimeDB from "mime-db";

const extensionMap = new Map<string, string>();
const entries = Object.entries(mimeDB);
for (const [mimetype, entry] of entries) {
  // eslint-disable-next-line
  // @ts-ignore
  if (!entry.extensions) {
    continue;
  }

  // eslint-disable-next-line
  // @ts-ignore
  const extensions = entry.extensions as string[];
  if (extensions.length) {
    for (const ext of extensions) {
      extensionMap.set(ext, mimetype);
    }
  }
}

export const EXTENSIONS_MAP = extensionMap;
