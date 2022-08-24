import type { EditorState } from "@codemirror/state";
import { useState } from "react";

import type { SandpackProviderProps, SandpackStatus } from "../..";


interface SandpackAppState {
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
}

type UseAppState = (props: SandpackProviderProps) => [SandpackAppState];

export const useAppState: UseAppState = (props) => {
  const [state, setState] = useState<SandpackAppState>({
    sandpackStatus: props.options?.autorun ?? true ? "initial" : "idle",
    editorState: "pristine" as unknown as EditorState,
  });

  return [state];
};