const MAX_CLIENT_DEPENDENCY_COUNT = 50;

type Dependencies = Record<string, string>;
interface PackageJSON {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
}
export function getTemplate(
  pkg: PackageJSON | null,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  modules: any
): string | undefined {
  if (!pkg) {
    return "static";
  }

  const { dependencies = {}, devDependencies = {} } = pkg;

  const totalDependencies = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
  ];
  const moduleNames = Object.keys(modules);

  const adonis = ["@adonisjs/framework", "@adonisjs/core"];

  if (totalDependencies.some((dep) => adonis.indexOf(dep) > -1)) {
    return "adonis";
  }

  const nuxt = ["nuxt", "nuxt-edge", "nuxt-ts", "nuxt-ts-edge", "nuxt3"];

  if (totalDependencies.some((dep) => nuxt.indexOf(dep) > -1)) {
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

  if (totalDependencies.some((dep) => apollo.indexOf(dep) > -1)) {
    return "apollo";
  }

  if (totalDependencies.indexOf("mdx-deck") > -1) {
    return "mdx-deck";
  }

  if (totalDependencies.indexOf("gridsome") > -1) {
    return "gridsome";
  }

  if (totalDependencies.indexOf("vuepress") > -1) {
    return "vuepress";
  }

  if (totalDependencies.indexOf("ember-cli") > -1) {
    return "ember";
  }

  if (totalDependencies.indexOf("sapper") > -1) {
    return "sapper";
  }

  if (totalDependencies.indexOf("gatsby") > -1) {
    return "gatsby";
  }

  if (totalDependencies.indexOf("quasar") > -1) {
    return "quasar";
  }

  if (totalDependencies.indexOf("@docusaurus/core") > -1) {
    return "docusaurus";
  }

  if (totalDependencies.indexOf("remix") > -1) {
    return "remix";
  }

  if (totalDependencies.indexOf("astro") > -1) {
    return "node";
  }

  // CLIENT

  if (moduleNames.some((m) => m.endsWith(".re"))) {
    return "reason";
  }

  const parcel = ["parcel-bundler", "parcel"];
  if (totalDependencies.some((dep) => parcel.indexOf(dep) > -1)) {
    return "parcel";
  }

  const dojo = ["@dojo/core", "@dojo/framework"];
  if (totalDependencies.some((dep) => dojo.indexOf(dep) > -1)) {
    return "@dojo/cli-create-app";
  }
  if (
    totalDependencies.indexOf("@nestjs/core") > -1 ||
    totalDependencies.indexOf("@nestjs/common") > -1
  ) {
    return "nest";
  }

  if (totalDependencies.indexOf("react-styleguidist") > -1) {
    return "styleguidist";
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

  if (
    totalDependencies.indexOf("@sveltech/routify") > -1 ||
    totalDependencies.indexOf("@roxi/routify") > -1
  ) {
    return "node";
  }

  if (totalDependencies.indexOf("vite") > -1) {
    return "node";
  }

  if (totalDependencies.indexOf("@frontity/core") > -1) {
    return "node";
  }

  if (totalDependencies.indexOf("svelte") > -1) {
    return "svelte";
  }

  if (totalDependencies.indexOf("vue") > -1) {
    return "vue-cli";
  }

  if (totalDependencies.indexOf("cx") > -1) {
    return "cxjs";
  }

  const nodeDeps = [
    "express",
    "koa",
    "nodemon",
    "ts-node",
    "@tensorflow/tfjs-node",
    "webpack-dev-server",
    "snowpack",
  ];
  if (totalDependencies.some((dep) => nodeDeps.indexOf(dep) > -1)) {
    return "node";
  }

  if (Object.keys(dependencies).length >= MAX_CLIENT_DEPENDENCY_COUNT) {
    // The dependencies are too much for client sandboxes to handle
    return "node";
  }

  return undefined;
}

export function getExtension(filepath: string): string {
  const parts = filepath.split(".");
  if (parts.length <= 1) {
    return "";
  } else {
    const ext = parts[parts.length - 1];
    return ext;
  }
}
