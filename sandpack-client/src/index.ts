/**
 * This is a small foundation package that sits on top of the bundler. It is
 * framework agnostic and facilitates the handshake between your context and the bundler iframe.
 *
 *
 * ```js
 * import { SandpackClient } from "@codesandbox/sandpack-client";
 *
 * const client = new SandpackClient("#preview", {
 *   files: {
 *     "/index.js": {
 *       code: `console.log(require('uuid'))`,
 *     },
 *   },
 *   entry: "/index.js",
 *   dependencies: {
 *     uuid: "latest",
 *   },
 * });
 * ```
 *
 * @module
 */

export * from "./client";
export * from "./utils";
export * from "./types";
