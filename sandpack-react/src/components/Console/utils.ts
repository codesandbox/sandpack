import type { SandpackMessageConsoleMethods } from "@codesandbox/sandpack-client";

export const getType = (
  message: SandpackMessageConsoleMethods
): "info" | "warning" | "error" | "clear" => {
  if (message === "log" || message === "info") {
    return "info";
  }

  if (message === "warn") {
    return "warning";
  }

  if (message === "clear") {
    return "clear";
  }

  return "info";
};

export type SandpackConsoleData = Array<{
  data: Array<string | Record<string, string>> | undefined;
  id: string;
  method: SandpackMessageConsoleMethods;
}>;
