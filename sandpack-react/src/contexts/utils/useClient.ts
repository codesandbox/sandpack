import type {
  BundlerState,
  ReactDevToolsMode,
  SandpackError,
} from "@codesandbox/sandpack-client";
import { useEffect, useState } from "react";

import type { SandpackInitMode, SandpackProviderProps, SandpackStatus } from "../..";

interface SandpackConfigState {
  reactDevTools?: ReactDevToolsMode;
  startRoute?: string;
  initMode: SandpackInitMode;
  bundlerState?: BundlerState;
  error: SandpackError | null;
  sandpackStatus: SandpackStatus;
}

type UseClient = (props: SandpackProviderProps) => [SandpackConfigState];

export const useClient: UseClient = (props) => {
  const initModeFromProps = props.options?.initMode || "lazy";

  const [state, setState] = useState<SandpackConfigState>({
    startRoute: props.options?.startRoute,
    bundlerState: undefined,
    error: null,
    initMode: initModeFromProps,
    reactDevTools: undefined,
    sandpackStatus: props.options?.autorun ?? true ? "initial" : "idle",
  });

  useEffect(
    function watchInitMode() {
      if (initModeFromProps !== state.initMode) {
        setState((prev) => ({ ...prev, initMode: initModeFromProps }));
        // TODO: initializeSandpackIframe()
      }
    },
    [initModeFromProps, state]
  );

  return [state];
};