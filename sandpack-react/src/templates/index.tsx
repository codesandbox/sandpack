import { ASTRO_TEMPLATE } from "./node/astro";
import { NEXTJS_TEMPLATE } from "./node/nexjs";
import { NODE_TEMPLATE } from "./node/node";
import { VITE_TEMPLATE } from "./node/vite";
import { VITE_REACT_TEMPLATE } from "./node/vite-react";
import { VITE_SVELTE_TEMPLATE } from "./node/vite-svelte";
import { VITE_VUE_TEMPLATE } from "./node/vite-vue";
import { ANGULAR_TEMPLATE } from "./runtime/angular";
import { REACT_TEMPLATE } from "./runtime/react";
import { REACT_TYPESCRIPT_TEMPLATE } from "./runtime/react-typescript";
import { SOLID_TEMPLATE } from "./runtime/solid";
import { SVELTE_TEMPLATE } from "./runtime/svelte";
import { TEST_TYPESCRIPT_TEMPLATE } from "./runtime/tests-ts";
import { VANILLA_TEMPLATE } from "./runtime/vanilla";
import { VANILLA_TYPESCRIPT_TEMPLATE } from "./runtime/vanilla-typescript";
import { VUE_TEMPLATE } from "./runtime/vue";
import { VUE_TS_TEMPLATE } from "./runtime/vue-ts";
export { ASTRO_TEMPLATE } from "./node/astro";
export { ANGULAR_TEMPLATE } from "./runtime/angular";
export { REACT_TEMPLATE } from "./runtime/react";
export { REACT_TYPESCRIPT_TEMPLATE } from "./runtime/react-typescript";
export { SOLID_TEMPLATE } from "./runtime/solid";
export { SVELTE_TEMPLATE } from "./runtime/svelte";
export { TEST_TYPESCRIPT_TEMPLATE } from "./runtime/tests-ts";
export { VANILLA_TEMPLATE } from "./runtime/vanilla";
export { VANILLA_TYPESCRIPT_TEMPLATE } from "./runtime/vanilla-typescript";
export { VUE_TEMPLATE } from "./runtime/vue";

export const SANDBOX_TEMPLATES = {
  angular: ANGULAR_TEMPLATE,
  react: REACT_TEMPLATE,
  "react-ts": REACT_TYPESCRIPT_TEMPLATE,
  solid: SOLID_TEMPLATE,
  svelte: SVELTE_TEMPLATE,
  "test-ts": TEST_TYPESCRIPT_TEMPLATE,
  "vanilla-ts": VANILLA_TYPESCRIPT_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
  vue: VUE_TEMPLATE,
  "vue-ts": VUE_TS_TEMPLATE,

  node: NODE_TEMPLATE,
  nextjs: NEXTJS_TEMPLATE,
  vite: VITE_TEMPLATE,
  "vite-react": VITE_REACT_TEMPLATE,
  "vite-vue": VITE_VUE_TEMPLATE,
  "vite-svelte": VITE_SVELTE_TEMPLATE,
  astro: ASTRO_TEMPLATE,
};
