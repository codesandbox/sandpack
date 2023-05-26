import { commonFiles } from "../common";

export const VITE_VUE_TS_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/App.vue": {
      code: `<script setup lang="ts">
import { ref } from "vue";

const data = ref<string>("world");
</script>

<template>
  <h1>Hello {{ data }}</h1>
</template>

<style>
h1 {
  font-size: 1.5rem;
}
</style>`,
    },
    "/src/main.ts": {
      code: `import { createApp } from 'vue'
import App from './App.vue'
import "./styles.css"

createApp(App).mount('#app')
`,
    },
    "/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
    },
    "/vite-env.d.ts": {
      code: '/// <reference types="vite/client" />',
    },
    "/vite.config.ts": {
      code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
`,
    },
    "tsconfig.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            target: "ESNext",
            useDefineForClassFields: true,
            module: "ESNext",
            moduleResolution: "Node",
            strict: true,
            jsx: "preserve",
            resolveJsonModule: true,
            isolatedModules: true,
            esModuleInterop: true,
            lib: ["ESNext", "DOM"],
            skipLibCheck: true,
            noEmit: true,
          },
          include: [
            "src/**/*.ts",
            "src/**/*.d.ts",
            "src/**/*.tsx",
            "src/**/*.vue",
          ],
          references: [{ path: "./tsconfig.node.json" }],
        },
        null,
        2
      ),
    },
    "tsconfig.node.json": {
      code: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            module: "ESNext",
            moduleResolution: "Node",
            allowSyntheticDefaultImports: true,
          },
          include: ["vite.config.ts"],
        },
        null,
        2
      ),
    },
    "/package.json": {
      code: JSON.stringify(
        {
          scripts: {
            dev: "vite",
            build: "tsc && vite build",
            preview: "vite preview",
          },
          dependencies: {
            vue: "^3.2.47",
          },
          devDependencies: {
            "@vitejs/plugin-vue": "^4.0.0",
            vite: "4.1.4",
            "vue-tsc": "^1.2.0",
            typescript: "^4.9.5",
            "esbuild-wasm": "^0.17.12",
          },
        },
        null,
        2
      ),
    },
  },
  main: "/src/App.vue",
  environment: "node",
};
