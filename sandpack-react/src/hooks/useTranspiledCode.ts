import type { SandpackState } from "../types";

import { useSandpack } from "./useSandpack";

function getTranspiledCode(sandpack: SandpackState) {
  const { activePath, bundlerState } = sandpack;
  if (bundlerState == null) {
    return null;
  }

  const tModule = bundlerState.transpiledModules[activePath + ":"];
  return tModule?.source?.compiledCode ?? null;
}

export const useTranspiledCode = (): string | null => {
  const { sandpack } = useSandpack();
  if (sandpack.status !== "running") {
    return null;
  }

  return getTranspiledCode(sandpack);
};
