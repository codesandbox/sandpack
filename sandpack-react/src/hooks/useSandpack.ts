import * as React from "react";

import { SandpackReactContext } from "../contexts/sandpackContext";
import type {
  SandpackClientDispatch,
  SandpackClientListen,
  SandpackState,
} from "../types";

/**
 * @category Hooks
 */
export interface UseSandpack {
  sandpack: SandpackState;
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
}

/**
 * @category Hooks
 */
export function useSandpack(): UseSandpack {
  const sandpack = React.useContext(SandpackReactContext);

  if (sandpack === null) {
    throw new Error(
      `[sandpack-react]: "useSandpack" must be wrapped by a "SandpackProvider"`
    );
  }

  const { dispatch, listen, ...rest } = sandpack;

  return {
    sandpack: { ...rest } as SandpackState,
    dispatch,
    listen,
  };
}
