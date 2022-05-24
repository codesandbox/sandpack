export { ANGULAR_TEMPLATE } from "./angular";
import { ANGULAR_TEMPLATE } from "./angular";
export { REACT_TEMPLATE } from "./react";
import { REACT_TEMPLATE } from "./react";
export { REACT_TYPESCRIPT_TEMPLATE } from "./react-typescript";
import { REACT_TYPESCRIPT_TEMPLATE } from "./react-typescript";
export { SOLID_TEMPLATE } from "./solid";
import { SOLID_TEMPLATE } from "./solid";
export { SVELTE_TEMPLATE } from "./svelte";
import { SVELTE_TEMPLATE } from "./svelte";
export { VANILLA_TEMPLATE } from "./vanilla";
import { VANILLA_TEMPLATE } from "./vanilla";
export { VANILLA_TYPESCRIPT_TEMPLATE } from "./vanilla-typescript";
import { VANILLA_TYPESCRIPT_TEMPLATE } from "./vanilla-typescript";
export { VUE_TEMPLATE } from "./vue";
import { VUE_TEMPLATE } from "./vue";
export { VUE_TEMPLATE_3 } from "./vue3";
import { VUE_TEMPLATE_3 } from "./vue3";

/**
 * @hidden
 */
export const SANDBOX_TEMPLATES = {
  react: REACT_TEMPLATE,
  "react-ts": REACT_TYPESCRIPT_TEMPLATE,
  vue: VUE_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
  "vanilla-ts": VANILLA_TYPESCRIPT_TEMPLATE,
  vue3: VUE_TEMPLATE_3,
  angular: ANGULAR_TEMPLATE,
  svelte: SVELTE_TEMPLATE,
  solid: SOLID_TEMPLATE,
};
