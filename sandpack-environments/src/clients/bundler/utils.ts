import { invariant } from "outvariant";

import type { SandpackFileSystem } from "../../types";

import type {
  SandpackBundlerFiles,
  Dependencies,
  SandpackErrorMessage,
  SandpackError,
  ErrorStackFrame,
} from "./types";

export const createError = (message: string): string =>
  `[sandpack-client]: ${message}`;

export function nullthrows<T>(value?: T | null, err = "Value is nullish"): T {
  invariant(value != null, createError(err));

  return value;
}

const DEPENDENCY_ERROR_MESSAGE = `"dependencies" was not specified - provide either a package.json or a "dependencies" value`;
const ENTRY_ERROR_MESSAGE = `"entry" was not specified - provide either a package.json with the "main" field or an "entry" value`;

export function createPackageJSON(entry = "/index.js"): string {
  return JSON.stringify(
    {
      name: "sandpack-project",
      main: entry,
      dependencies: {},
      devDependencies: {},
    },
    null,
    2
  );
}

export function ensureValidBundlerFiles(
  files: SandpackBundlerFiles,
  entry?: string
): SandpackBundlerFiles {
  const normalizedFiles = normalizePaths(files);

  const packageJsonFile = normalizedFiles["/package.json"];

  if (!packageJsonFile) {
    normalizedFiles["/package.json"] = {
      code: createPackageJSON(entry),
    };
  }

  return normalizedFiles;
}

export function extractErrorDetails(msg: SandpackErrorMessage): SandpackError {
  if (msg.title === "SyntaxError") {
    const { title, path, message, line, column } = msg;
    return { title, path, message, line, column };
  }

  const relevantStackFrame = getRelevantStackFrame(msg.payload?.frames);
  if (!relevantStackFrame) {
    return { message: msg.message };
  }

  const errorInCode = getErrorInOriginalCode(relevantStackFrame);
  const errorLocation = getErrorLocation(relevantStackFrame);
  const errorMessage = formatErrorMessage(
    relevantStackFrame._originalFileName,
    msg.message,
    errorLocation,
    errorInCode
  );

  return {
    message: errorMessage,
    title: msg.title,
    path: relevantStackFrame._originalFileName,
    line: relevantStackFrame._originalLineNumber,
    column: relevantStackFrame._originalColumnNumber,
  };
}

function getRelevantStackFrame(
  frames?: ErrorStackFrame[]
): ErrorStackFrame | undefined {
  if (!frames) {
    return;
  }

  return frames.find((frame) => !!frame._originalFileName);
}

function getErrorLocation(errorFrame: ErrorStackFrame): string {
  return errorFrame
    ? ` (${errorFrame._originalLineNumber}:${errorFrame._originalColumnNumber})`
    : ``;
}

function getErrorInOriginalCode(errorFrame: ErrorStackFrame): string {
  const lastScriptLine =
    errorFrame._originalScriptCode[errorFrame._originalScriptCode.length - 1];
  const numberOfLineNumberCharacters =
    lastScriptLine.lineNumber.toString().length;

  const leadingCharacterOffset = 2;
  const barSeparatorCharacterOffset = 3;
  const extraLineLeadingSpaces =
    leadingCharacterOffset +
    numberOfLineNumberCharacters +
    barSeparatorCharacterOffset +
    errorFrame._originalColumnNumber;

  return errorFrame._originalScriptCode.reduce((result, scriptLine) => {
    const leadingChar = scriptLine.highlight ? ">" : " ";
    const lineNumber =
      scriptLine.lineNumber.toString().length === numberOfLineNumberCharacters
        ? `${scriptLine.lineNumber}`
        : ` ${scriptLine.lineNumber}`;

    const extraLine = scriptLine.highlight
      ? "\n" + " ".repeat(extraLineLeadingSpaces) + "^"
      : "";

    return (
      result + // accumulator
      "\n" +
      leadingChar + // > or " "
      " " +
      lineNumber + // line number on equal number of characters
      " | " +
      scriptLine.content + // code
      extraLine // line under the highlighed line to show the column index
    );
  }, "");
}

function formatErrorMessage(
  filePath: string,
  message: string,
  location: string,
  errorInCode: string
): string {
  return `${filePath}: ${message}${location}
${errorInCode}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizePaths = <R>(path: R): R => {
  if (typeof path === "string") {
    return (path.startsWith("/") ? path : `/${path}`) as R;
  }

  if (Array.isArray(path)) {
    return path.map((p) => (p.startsWith("/") ? p : `/${p}`)) as R;
  }

  if (typeof path === "object" && path !== null) {
    return Object.entries(path as any).reduce<any>(
      (acc, [key, content]: [string, string | any]) => {
        const fileName = key.startsWith("/") ? key : `/${key}`;

        acc[fileName] = content;

        return acc;
      },
      {}
    );
  }

  return null as R;
};
const MAX_CLIENT_DEPENDENCY_COUNT = 50;

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

export async function readAllFiles(
  fs: SandpackFileSystem,
  directoryPath: string,
  files: SandpackBundlerFiles
) {
  const entries = await fs.readDirectory(directoryPath);

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath =
        directoryPath === "/"
          ? directoryPath + entry.name
          : directoryPath + "/" + entry.name;
      if (entry.type === "directory") {
        return readAllFiles(fs, fullPath, files);
      }

      const code = await fs.readFile(fullPath);

      if (typeof code === "string") {
        files[fullPath] = { code };
      }
    })
  );

  return files;
}
