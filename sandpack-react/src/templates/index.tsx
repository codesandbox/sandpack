import type { SandpackPredefinedTemplate, SandboxTemplate } from "../types";

import { ANGULAR_TEMPLATE } from "./angular";
import { REACT_TEMPLATE } from "./react";
import { REACT_TYPESCRIPT_TEMPLATE } from "./react-typescript";
import { SVELTE_TEMPLATE } from "./svelte";
import { VANILLA_TEMPLATE } from "./vanilla";
import { VANILLA_TYPESCRIPT_TEMPLATE } from "./vanilla-typescript";
import { VUE_TEMPLATE } from "./vue";
import { VUE_TEMPLATE_3 } from "./vue3";

export const SANDBOX_TEMPLATES: Record<
  SandpackPredefinedTemplate,
  SandboxTemplate
> = {
  react: REACT_TEMPLATE,
  "react-ts": REACT_TYPESCRIPT_TEMPLATE,
  vue: VUE_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
  "vanilla-ts": VANILLA_TYPESCRIPT_TEMPLATE,
  vue3: VUE_TEMPLATE_3,
  angular: ANGULAR_TEMPLATE,
  svelte: SVELTE_TEMPLATE,
};
