import type { Template, Environments } from "../types";

import { SandpackClientRuntime } from "./runtime";

const templateEnvs: Array<[Template, Environments]> = [
  ["angular-cli", "runtime"],
  ["create-react-app", "runtime"],
  ["create-react-app-typescript", "runtime"],
  ["parcel", "runtime"],
  ["solid", "runtime"],
  ["static", "runtime"],
  ["svelte", "runtime"],
  ["vue-cli", "runtime"],
  ["nextjs", "server-runtime"],
];

const templates = new Map(templateEnvs);

export class SandpackClient {}