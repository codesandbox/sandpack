import { useSandpack } from "./useSandpack";

export const useSandpackNavigation = (
  clientId?: string
): {
  refresh: () => void;
  back: () => void;
  forward: () => void;
} => {
  const { dispatch } = useSandpack();

  return {
    refresh: () => dispatch({ type: "refresh" }, clientId),
    back: () => dispatch({ type: "urlback" }, clientId),
    forward: () => dispatch({ type: "urlforward" }, clientId),
  };
};
