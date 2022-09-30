import type {
  SandpackBundlerFiles,
  Dependencies,
  SandpackErrorMessage,
  SandpackError,
  ErrorStackFrame,
} from "./types";

const DEPENDENCY_ERROR_MESSAGE = `[sandpack-client]: "dependencies" was not specified - provide either a package.json or a "dependencies" value`;
const ENTRY_ERROR_MESSAGE = `[sandpack-client]: "entry" was not specified - provide either a package.json with the "main" field or na "entry" value`;

export function createPackageJSON(
  dependencies: Dependencies = {},
  devDependencies: Dependencies = {},
  entry = "/index.js"
): string {
  return JSON.stringify(
    {
      name: "sandpack-project",
      main: entry,
      dependencies,
      devDependencies,
    },
    null,
    2
  );
}

export function addPackageJSONIfNeeded(
  files: SandpackBundlerFiles,
  dependencies?: Dependencies,
  devDependencies?: Dependencies,
  entry?: string
): SandpackBundlerFiles {
  const normalizedFilesPath = normalizePath(files);

  const packageJsonFile = normalizedFilesPath["/package.json"];

  /**
   * Create a new package json
   */
  if (!packageJsonFile) {
    if (!dependencies) throw new Error(DEPENDENCY_ERROR_MESSAGE);
    if (!entry) throw new Error(ENTRY_ERROR_MESSAGE);

    normalizedFilesPath["/package.json"] = {
      code: createPackageJSON(dependencies, devDependencies, entry),
    };

    return normalizedFilesPath;
  }

  /**
   * Merge package json with custom setup
   */
  if (packageJsonFile) {
    const packageJsonContent = JSON.parse(packageJsonFile.code);

    if (!dependencies && !packageJsonContent.dependencies) {
      throw new Error(DEPENDENCY_ERROR_MESSAGE);
    }

    if (dependencies) {
      packageJsonContent.dependencies = {
        ...(packageJsonContent.dependencies ?? {}),
        ...(dependencies ?? {}),
      };
    }

    if (devDependencies) {
      packageJsonContent.devDependencies = {
        ...(packageJsonContent.devDependencies ?? {}),
        ...(devDependencies ?? {}),
      };
    }

    if (entry) {
      packageJsonContent.main = entry;
    }

    normalizedFilesPath["/package.json"] = {
      code: JSON.stringify(packageJsonContent, null, 2),
    };
  }

  return normalizedFilesPath;
}

export function extractErrorDetails(msg: SandpackErrorMessage): SandpackError {
  if (msg.title === "SyntaxError") {
    const { title, path, message, line, column } = msg;
    return { title, path, message, line, column };
  }

  const relevantStackFrame = getRelevantStackFrame(msg.payload.frames);
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
export const normalizePath = <R extends any>(path: R): R => {
  if (typeof path === "string") {
    return (path.startsWith("/") ? path : `/${path}`) as R;
  }

  if (Array.isArray(path)) {
    return path.map((p) => (p.startsWith("/") ? p : `/${p}`)) as R;
  }

  if (typeof path === "object") {
    return Object.entries(path as any).reduce<any>(
      (acc, [key, content]: [string, string | any]) => {
        const fileName = key.startsWith("/") ? key : `/${key}`;

        acc[fileName] = content;

        return acc;
      },
      {}
    );
  }

  return undefined as R;
};
