import crypto from "crypto";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

const subtle = {
  digest: async function (
    algorithm: string,
    data: Uint8Array
  ): Promise<ArrayBuffer> {
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(data));
    return hash.digest().buffer;
  },
};

const webCrypto = {
  subtle,
  getRandomValues: function (buffer: Uint8Array): Uint8Array {
    return crypto.randomFillSync(buffer);
  },
};

Object.defineProperty(global, "crypto", {
  value: webCrypto,
  writable: true,
  configurable: true,
  enumerable: true,
});
