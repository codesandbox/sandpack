import * as React from "react";

import { SandpackReactContext } from "../contexts/sandpackContext";
import type {
  SandpackClientDispatch,
  SandpackClientListen,
  SandpackState,
} from "../types";

interface UseSandpackReturnType {
  sandpack: SandpackState;
  dispatch: SandpackClientDispatch;
  listen: SandpackClientListen;
}

export function useSandpack(): UseSandpackReturnType {
  const sandpack = React.useContext(SandpackReactContext);

  if (sandpack === null) {
    throw new Error(
      `useSandpack can only be used inside components wrapped by 'SandpackProvider'`
    );
  }

  const { dispatch, listen, ...rest } = sandpack;

  return {
    sandpack: { ...rest } as SandpackState,
    dispatch,
    listen,
  };
}
