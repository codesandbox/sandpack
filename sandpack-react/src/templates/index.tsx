import type { SandpackPredefinedTemplate, SandboxTemplate } from "../types";

import { ANGULAR_TEMPLATE } from "./angular";
import { REACT_TEMPLATE } from "./react";
import { VANILLA_TEMPLATE } from "./vanilla";
import { VUE_TEMPLATE } from "./vue";
import { VUE_TEMPLATE_3 } from "./vue3";

export const SANDBOX_TEMPLATES: Record<
  SandpackPredefinedTemplate,
  SandboxTemplate
> = {
  react: REACT_TEMPLATE,
  vue: VUE_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
  vue3: VUE_TEMPLATE_3,
  angular: ANGULAR_TEMPLATE,
};
