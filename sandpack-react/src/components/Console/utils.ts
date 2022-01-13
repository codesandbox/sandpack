export const getType = (message: Methods): "info" | "warning" | "error" => {
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
  method: Methods;
}>;

type Methods =
  | "log"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "table"
  | "clear"
  | "time"
  | "timeEnd"
  | "count"
  | "assert";
