import type { SandboxTemplate } from "../types";

export const VUE_TEMPLATE_3: SandboxTemplate = {
  files: {
    "/src/App.vue": {
      code: `<template>
  <main id="app">
    <h1>{{ helloWorld }}</h1>
  </main>
</template>
                             
<script>
import { ref } from "vue";
export default {
   name: "App",
   setup() {
      const helloWorld = ref("hello world");
      return { helloWorld };
   }
};
</script>
                             
<style>
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
margin-top: 60px;
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
  },
  dependencies: {
    "core-js": "^3.6.5",
    vue: "^3.0.0-0",
    "@vue/cli-plugin-babel": "4.5.0",
  },
  entry: "/src/main.js",
  main: "/src/App.vue",
  environment: "vue-cli",
};
