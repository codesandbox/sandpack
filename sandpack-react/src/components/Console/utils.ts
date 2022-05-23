import type { SandpackConsoleMethods } from "@codesandbox/sandpack-client";

export const getType = (
  message: SandpackConsoleMethods
): "info" | "warning" | "error" => {
  if (message === "log" || message === "info") {
    return "info";
  }

  if (message === "warn") {
    return "warning";
  }

  return "error";
};

export type ConsoleData = Array<{
  data: Array<string | Record<string, string>>;
  id: string;
  method: SandpackConsoleMethods;
}>;
