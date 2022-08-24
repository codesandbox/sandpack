import type { EditorState } from "@codemirror/state";
import type {
  BundlerState,
  ReactDevToolsMode,
  SandpackError,
} from "@codesandbox/sandpack-client";
import { useState } from "react";

import type {
  SandpackInitMode,
  SandpackProviderProps,
  SandpackStatus,
} from "../..";

interface SandpackConfigState {
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
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
    sandpackStatus: props.options?.autorun ?? true ? "initial" : "idle",
    editorState: "pristine" as const,
    initMode: props.options?.initMode || "lazy",
    reactDevTools: undefined,
  });

  return [state];
};