import type {
  SandpackBundlerFiles,
  Dependencies,
  SandpackErrorMessage,
  SandpackError,
  ErrorStackFrame,
} from "./types";

export function createPackageJSON(
  dependencies: Dependencies = {},
  entry = "/index.js"
): string {
  return JSON.stringify(
    {
      name: "sandpack-project",
      main: entry,
      dependencies,
    },
    null,
    2
  );
}

export function addPackageJSONIfNeeded(
  files: SandpackBundlerFiles,
  dependencies?: Dependencies,
  entry?: string
): SandpackBundlerFiles {
  const newFiles = { ...files };

  if (!newFiles["/package.json"]) {
    if (!dependencies) {
      throw new Error(
        "No dependencies specified, please specify either a package.json or dependencies."
      );
    }

    if (!entry) {
      throw new Error(
        "Missing 'entry' parameter. Either specify an entry point, or pass in a package.json with the 'main' field set."
      );
    }

    newFiles["/package.json"] = {
      code: createPackageJSON(dependencies, entry),
    };
  }

  return newFiles;
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

function getRelevantStackFrame(frames?: ErrorStackFrame[]) {
  if (!frames) {
    return;
  }

  return frames.find((frame) => !!frame._originalFileName);
}

function getErrorLocation(errorFrame: ErrorStackFrame) {
  return errorFrame
    ? ` (${errorFrame._originalLineNumber}:${errorFrame._originalColumnNumber})`
    : ``;
}

function getErrorInOriginalCode(errorFrame: ErrorStackFrame) {
  const lastScriptLine =
    errorFrame._originalScriptCode[errorFrame._originalScriptCode.length - 1];
  const numberOfLineNumberCharacters = lastScriptLine.lineNumber.toString()
    .length;

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
) {
  return `${filePath}: ${message}${location}
${errorInCode}`;
}
