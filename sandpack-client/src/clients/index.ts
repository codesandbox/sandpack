import type { SandboxInfo } from "..";
import type { Template } from "../types";

import { SandpackClientBase } from "./base";
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
  const Client =
    (sandboxInfo.template && templates.get(sandboxInfo.template)) ??
    SandpackClientBase;

  return new Client(selector, sandboxInfo, options);
};

export const SandpackClient =
  SandpackClientImp as unknown as typeof SandpackClientBase;