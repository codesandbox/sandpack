/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
function getMainFile(template: string) {
  if (template === "vue-cli") {
    return "src/main.js";
  }
  if (template === "angular-cli") {
    return "src/main.ts";
  }
  if (template === "create-react-app-typescript") {
    return "src/index.tsx";
  }
  if (template === "parcel") {
    return "index.html";
  }
  if (template === "gatsby") {
    return "src/pages/index.js";
  }
  if (template === "nuxt") {
    // Wildcard, because nuxt is not specific on this
    return "package.json";
  }
  if (template === "next") {
    // Wildcard, because next is not specific on this
    return "package.json";
  }
  if (template === "apollo") {
    // Wildcard, because apollo is not specific on this
    return "package.json";
  }
  if (template === "reason") {
    // Wildcard, because reason is not specific on this
    return "package.json";
  }
  if (template === "sapper") {
    // Wildcard, because sapper is not specific on this
    return "package.json";
  }
  if (template === "nest") {
    return "src/main.ts";
  }
  if (template === "static") {
    return "index.html";
  }
  return "src/index.js";
}
exports.getMainFile = getMainFile;
const SANDBOX_CONFIG = "sandbox.config.json";

function getTemplate(packageJSONPackage: any, modules: any): any {
  const sandboxConfig =
    modules[SANDBOX_CONFIG] || modules["/" + SANDBOX_CONFIG];
  if (sandboxConfig) {
    try {
      const config = JSON.parse(sandboxConfig.content);
      if (config.template) {
        return config.template;
      }
    } catch (e) {
      console.error(e)
    }
  }
  const _a = packageJSONPackage.dependencies,
    dependencies = _a === void 0 ? {} : _a,
    _b = packageJSONPackage.devDependencies,
    devDependencies = _b === void 0 ? {} : _b;
  const totalDependencies = Object.keys(dependencies).concat(
    Object.keys(devDependencies)
  );
  const nuxt = ["nuxt", "nuxt-edge"];
  if (
    totalDependencies.some(function (dep) {
      return nuxt.indexOf(dep) > -1;
    })
  ) {
    return "nuxt";
  }
  if (totalDependencies.indexOf("next") > -1) {
    return "next";
  }
  const apollo = [
    "apollo-server",
    "apollo-server-express",
    "apollo-server-hapi",
    "apollo-server-koa",
    "apollo-server-lambda",
    "apollo-server-micro",
  ];
  if (
    totalDependencies.some(function (dep) {
      return apollo.indexOf(dep) > -1;
    })
  ) {
    return "apollo";
  }
  if (totalDependencies.indexOf("ember-cli") > -1) {
    return "ember";
  }
  if (totalDependencies.indexOf("sapper") > -1) {
    return "sapper";
  }
  const moduleNames = Object.keys(modules);
  if (
    moduleNames.some(function (m) {
      return m.endsWith(".vue");
    })
  ) {
    return "vue-cli";
  }
  if (
    moduleNames.some(function (m) {
      return m.endsWith(".re");
    })
  ) {
    return "reason";
  }
  if (totalDependencies.indexOf("gatsby") > -1) {
    return "gatsby";
  }
  if (totalDependencies.indexOf("parcel-bundler") > -1) {
    return "parcel";
  }
  if (totalDependencies.indexOf("react-scripts") > -1) {
    return "create-react-app";
  }
  if (totalDependencies.indexOf("react-scripts-ts") > -1) {
    return "create-react-app-typescript";
  }
  if (totalDependencies.indexOf("@angular/core") > -1) {
    return "angular-cli";
  }
  if (totalDependencies.indexOf("preact-cli") > -1) {
    return "preact-cli";
  }
  if (totalDependencies.indexOf("svelte") > -1) {
    return "svelte";
  }
  if (totalDependencies.indexOf("vue") > -1) {
    return "vue-cli";
  }
  const dojo = ["@dojo/core", "@dojo/framework"];
  if (
    totalDependencies.some(function (dep) {
      return dojo.indexOf(dep) > -1;
    })
  ) {
    return "@dojo/cli-create-app";
  }
  if (totalDependencies.indexOf("cx") > -1) {
    return "cxjs";
  }
  if (
    totalDependencies.indexOf("@nestjs/core") > -1 ||
    totalDependencies.indexOf("@nestjs/common") > -1
  ) {
    return "nest";
  }
  return undefined;
}
export { getTemplate };
