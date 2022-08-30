import type { SandpackMessageConsoleMethods } from "@codesandbox/sandpack-client";

export const getType = (
  message: SandpackMessageConsoleMethods
): "info" | "warning" | "error" | "clear" => {
  switch (message) {
    case "warn":
      return "warning";

    case "clear":
      return "clear";

    case "error":
      return "error";

    case "log":
    case "info":
    default:
      return "info";
  }
};

export type SandpackConsoleData = Array<{
  data: Array<string | Record<string, string>> | undefined;
  id: string;
  method: SandpackMessageConsoleMethods;
}>;
