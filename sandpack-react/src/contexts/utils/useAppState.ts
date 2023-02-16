import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import isEqual from "lodash.isequal";
import { useState } from "react";

import type { SandpackProviderProps } from "../..";
import { getSandpackStateFromProps } from "../../utils/sandpackUtils";

interface SandpackAppState {
  editorState: "pristine" | "dirty";
}

type UseAppState = (
  props: SandpackProviderProps,
  files: SandpackBundlerFiles
) => SandpackAppState;

export const useAppState: UseAppState = (props, files) => {
  const [state, setState] = useState<SandpackAppState>({
    editorState: "pristine",
  });

  const originalStateFromProps = getSandpackStateFromProps(props);
  const editorState = isEqual(originalStateFromProps.files, files)
    ? "pristine"
    : "dirty";

  if (editorState !== state.editorState) {
    setState((prev) => ({ ...prev, editorState }));
  }

  return state;
};
