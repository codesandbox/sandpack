/* eslint-disable no-console,@typescript-eslint/no-explicit-any,prefer-rest-params */
import type { SandboxInfo } from "..";
import type { Template } from "../types";

import type { SandpackClient as SandpackClientBase } from "./base";
import type { ClientOptions } from "./base";
import { Runtime } from "./runtime";
import { RuntimeServer } from "./runtime-server";

const templateEnvs: Array<[Template, typeof SandpackClientBase]> = [
  ["angular-cli", Runtime],
  ["create-react-app", Runtime],
  ["create-react-app-typescript", Runtime],
  ["parcel", Runtime],
  ["solid", Runtime],
  ["static", Runtime],
  ["svelte", Runtime],
  ["vue-cli", Runtime],
  ["nextjs", RuntimeServer],
];

const templates = new Map(templateEnvs);

const sandpackClientFactory = (
  selector: string | HTMLIFrameElement,
  sandboxInfo: SandboxInfo,
  options: ClientOptions = {}
): SandpackClientBase => {
  const template = sandboxInfo.template ?? "parcel";
  const Client = templates.get(template)!;

  return new Client(selector, sandboxInfo, options);
};

export const SandpackClient =
  sandpackClientFactory as unknown as SandpackClientBase;