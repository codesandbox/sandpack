/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "..";
import type { Template } from "../types";

import type { SandpackClient as SandpackClientBase } from "./base";
import type { ClientOptions } from "./base";
import { SandpackClientRuntime } from "./runtime";
import { SandpackClientRuntimeServer } from "./runtime-server";

const templateEnvs: Array<[Template, typeof SandpackClientBase]> = [
  ["angular-cli", SandpackClientRuntime],
  ["create-react-app", SandpackClientRuntime],
  ["create-react-app-typescript", SandpackClientRuntime],
  ["parcel", SandpackClientRuntime],
  ["solid", SandpackClientRuntime],
  ["static", SandpackClientRuntime],
  ["svelte", SandpackClientRuntime],
  ["vue-cli", SandpackClientRuntime],
  ["nextjs", SandpackClientRuntimeServer],
];

const templates = new Map(templateEnvs);

const SandpackClientImp = (
  selector: string | HTMLIFrameElement,
  sandboxInfo: SandboxInfo,
  options: ClientOptions = {}
): SandpackClientBase => {
  const template = sandboxInfo.template ?? "parcel";
  const Client = templates.get(template)!;

  return new Client(selector, sandboxInfo, options);
};

export const SandpackClient =
  SandpackClientImp as unknown as SandpackClientBase;