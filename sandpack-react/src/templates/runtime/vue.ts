import { commonFiles } from "../common";

export const VUE_TEMPLATE = {
  files: {
    "/src/styles.css": commonFiles["/styles.css"],
    "/src/App.vue": {
      code: `<template>
  <h1>Hello {{ msg }}</h1>
</template>

<script setup>
import { ref } from 'vue';
const msg = ref('world');
</script>`,
    },
    "/src/main.js": {
      code: `import { createApp } from 'vue'
import App from './App.vue'
import "./styles.css";

createApp(App).mount('#app')
`,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>codesandbox</title>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but codesandbox doesn't work properly without JavaScript
        enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`,
    },
    "/package.json": {
      code: JSON.stringify({
        name: "vue3",
        version: "0.1.0",
        private: true,
        main: "/src/main.js",
        scripts: {
          serve: "vue-cli-service serve",
          build: "vue-cli-service build",
        },
        dependencies: {
          "core-js": "^3.26.1",
          vue: "^3.2.45",
        },
        devDependencies: {
          "@vue/cli-plugin-babel": "^5.0.8",
          "@vue/cli-service": "^5.0.8",
        },
      }),
    },
  },
  main: "/src/App.vue",
  environment: "vue-cli",
};
