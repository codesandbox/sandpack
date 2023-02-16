import { useSandpack } from "./useSandpack";

/**
 * @category Hooks
 */
export const useSandpackShell = (
  clientId?: string
): {
  restart: () => void;
  openPreview: () => void;
} => {
  const { dispatch } = useSandpack();

  return {
    restart: (): void => dispatch({ type: "shell/restart" }, clientId),
    openPreview: (): void => dispatch({ type: "shell/openPreview" }, clientId),
  };
};
