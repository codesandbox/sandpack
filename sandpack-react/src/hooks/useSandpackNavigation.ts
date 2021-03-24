import { useSandpack } from "./useSandpack";

export const useSandpackNavigation = (): {
  refresh: () => void;
  back: () => void;
  forward: () => void;
} => {
  const { dispatch } = useSandpack();

  return {
    refresh: () => dispatch({ type: "refresh" }),
    back: () => dispatch({ type: "urlback" }),
    forward: () => dispatch({ type: "urlforward" }),
  };
};
