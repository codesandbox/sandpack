/**
 * @hidden
 */
export const VUE_TEMPLATE = {
  files: {
    "/src/App.vue": {
      code: `<template>
  <div id="app">
    <h1>Hello {{ msg }}</h1>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: "App",
  data() {
    return {
      msg: "World",
    };
  },
});
</script>`,
    },
    "/src/main.js": {
      code: `import Vue from "vue";
import App from "./App.vue";
Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
`,
    },
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
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
        name: "vue",
        version: "0.1.0",
        private: true,
        main: "/src/main.js",
        scripts: {
          serve: "vue-cli-service serve",
          build: "vue-cli-service build",
        },
        dependencies: {
          "core-js": "^3.26.1",
          vue: "^2.7.14",
        },
        devDependencies: {
          "@vue/cli-plugin-babel": "^5.0.8",
          "@vue/cli-service": "^5.0.8",
          "vue-template-compiler": "^2.7.14",
        },
      }),
    },
  },
  main: "/src/App.vue",
  environment: "vue-cli",
};
