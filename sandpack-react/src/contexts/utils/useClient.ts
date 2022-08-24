import type {
  BundlerState,
  ReactDevToolsMode,
  SandpackError,
} from "@codesandbox/sandpack-client";
import { useState } from "react";

import type { SandpackInitMode, SandpackProviderProps } from "../..";

interface SandpackConfigState {
  reactDevTools?: ReactDevToolsMode;
  startRoute?: string;
  initMode: SandpackInitMode;
  bundlerState?: BundlerState;
  error: SandpackError | null;
}

type UseClient = (props: SandpackProviderProps) => [SandpackConfigState];

export const useClient: UseClient = (props) => {
  const [state, setState] = useState<SandpackConfigState>({
    startRoute: props.options?.startRoute,
    bundlerState: undefined,
    error: null,
    initMode: props.options?.initMode || "lazy",
    reactDevTools: undefined,
  });

  return [state];
};