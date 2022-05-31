import type { SandpackState } from "../types";

import { useSandpack } from "./useSandpack";

function getTranspiledCode(sandpack: SandpackState): string | null {
  const { activeFile, bundlerState } = sandpack;
  if (bundlerState == null) {
    return null;
  }

  const tModule = bundlerState.transpiledModules[activeFile + ":"];
  return tModule?.source?.compiledCode ?? null;
}

/**
 * @category Hooks
 */
export const useTranspiledCode = (): string | null => {
  const { sandpack } = useSandpack();
  if (sandpack.status !== "running") {
    return null;
  }

  return getTranspiledCode(sandpack);
};
