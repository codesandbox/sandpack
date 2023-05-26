import { useSandpack } from "./useSandpack";

/**
 * @category Hooks
 */
export const useErrorMessage = (): string | null => {
  const { sandpack } = useSandpack();
  const { error } = sandpack;

  return error?.message ?? null;
};
