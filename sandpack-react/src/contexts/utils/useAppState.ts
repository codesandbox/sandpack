import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { dequal as deepEqual } from "dequal";
import { useState } from "react";

import type { SandpackProviderProps } from "../..";

interface SandpackAppState {
  editorState: "pristine" | "dirty";
}

type UseAppState = (
  props: SandpackProviderProps<any>,
  files: SandpackBundlerFiles
) => SandpackAppState;

export const useAppState: UseAppState = (props, files) => {
  const [state, setState] = useState<SandpackAppState>({
    editorState: "pristine",
  });

  const editorState = deepEqual({}, files) ? "pristine" : "dirty";

  if (editorState !== state.editorState) {
    setState((prev) => ({ ...prev, editorState }));
  }

  return state;
};
