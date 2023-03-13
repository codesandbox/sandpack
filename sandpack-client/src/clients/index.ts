/* eslint-disable @typescript-eslint/no-explicit-any,prefer-rest-params */
import type { ClientOptions, SandboxSetup } from "../types";

import type { SandpackClient as SandpackClientBase } from "./base";

export type { SandpackClient } from "./base";

export async function loadSandpackClient(
  iframeSelector: string | HTMLIFrameElement,
  sandboxSetup: SandboxSetup,
  options: ClientOptions = {}
): Promise<SandpackClientBase> {
  const template = sandboxSetup.template ?? "parcel";

  let Client;

  switch (template) {
    case "node":
      Client = await import("./node").then((m) => m.SandpackNode);
      break;
    case "static":
      Client = await import("./static").then((m) => m.SandpackStatic);
      break;

    default:
      Client = await import("./runtime").then((m) => m.SandpackRuntime);
  }

  return new Client(iframeSelector, sandboxSetup, options);
}
