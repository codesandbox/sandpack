import { commonFiles } from "../common";

/**
 * @hidden
 */
export const ASTRO_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/pages/index.astro": {
      code: `---
import "../styles.css";
const data = "world";
---

<h1>Hello {data}</h1>

<style>
  h1 {
    font-size: 1.5rem;
  }
</style>`,
    },

    ".env": {
      code: `ASTRO_TELEMETRY_DISABLED="1"`,
    },

    "/package.json": {
      code: JSON.stringify({
        dependencies: {
          astro: "^1.6.12",
          "esbuild-wasm": "^0.15.16",
        },
        scripts: {
          dev: "astro dev",
          start: "astro dev",
          build: "astro build",
          preview: "astro preview",
          astro: "astro",
        },
      }),
    },
  },
  main: "/src/pages/index.astro",
  environment: "node",
};
