import { useSandpack } from "./useSandpack";

/**
 * @category Hooks
 */
export const useSandpackNavigation = (
  clientId?: string
): {
  refresh: () => void;
  back: () => void;
  forward: () => void;
} => {
  const { dispatch } = useSandpack();

  return {
    refresh: (): void => dispatch({ type: "refresh" }, clientId),
    back: (): void => dispatch({ type: "urlback" }, clientId),
    forward: (): void => dispatch({ type: "urlforward" }, clientId),
  };
};
