import { commonFiles } from "../common";

export const VITE_VUE_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/App.vue": {
      code: `<script setup>
import { ref } from "vue";

const data = ref("world");
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
    "/src/main.js": {
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
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
`,
    },
    "/vite.config.js": {
      code: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
`,
    },

    "/package.json": {
      code: JSON.stringify({
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          vue: "^3.2.45",
        },
        devDependencies: {
          "@vitejs/plugin-vue": "3.2.0",
          vite: "4.1.4",
          "esbuild-wasm": "0.17.12",
        },
      }),
    },
  },
  main: "/src/App.vue",
  environment: "node",
};
