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
  const { dispatch, sandpack } = useSandpack();

  return {
    refresh: (): void => {
      console.log(sandpack.clients);
      dispatch({ type: "refresh" }, clientId);
    },
    back: (): void => dispatch({ type: "urlback" }, clientId),
    forward: (): void => dispatch({ type: "urlforward" }, clientId),
  };
};
