/**
 * @hidden
 */
export const VUE_TEMPLATE_3 = {
  files: {
    "/src/App.vue": {
      code: `<script setup>
import { ref } from "vue";

const msg = ref("world");
</script>

<template>
  <h1>Hello {{ msg }}</h1>
</template>
                             
<style>
body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}
</style>   
`,
    },
    "/src/main.js": {
      code: `import { createApp } from 'vue'
import App from './App.vue'
            
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
        dependencies: {
          "core-js": "^3.6.5",
          vue: "^3.0.0-0",
          "@vue/cli-plugin-babel": "4.5.0",
        },
        main: "/src/main.js",
      }),
    },
  },
  main: "/src/App.vue",
  environment: "vue-cli",
};
