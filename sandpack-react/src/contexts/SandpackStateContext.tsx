import { createContext, useContext } from "react";
import { useCallback, useMemo, useState } from "react";

import type {
  OnChangeFunction,
  SandboxChangeEvent,
  SandboxConfiguration,
  SandpackProviderProps,
} from "../types";

import { useSandbox } from "./SandpackSandboxContext";

interface SandpackState {
  activeFile: string | null;
  setActiveFile(filepath: string): void;
  triggerChange(event: SandboxChangeEvent): Promise<void>;
}

export const SandpackStateContext = createContext<SandpackState | null>(null);

export function SandpackStateProvider({
  children,
  sandboxConfiguration,
  onChange,
}: {
  children: React.ReactNode;
  sandboxConfiguration?: SandboxConfiguration;
  onChange?: OnChangeFunction;
}) {
  const { environment, sandbox } = useSandbox();
  const [state, setState] = useState({
    activeFile: sandboxConfiguration?.activeFile ?? null,
  });

  const setActiveFile = useCallback(
    (activeFile: string) => {
      setState({
        ...state,
        activeFile,
      });
    },
    [state]
  );

  const triggerChange = useCallback(
    async (event: SandboxChangeEvent) => {
      return onChange?.(event, sandbox);
    },
    [environment, state.activeFile]
  );

  const value = useMemo(
    () => ({
      ...state,
      setActiveFile,
      triggerChange,
    }),
    [state, setActiveFile]
  );

  return (
    <SandpackStateContext.Provider value={value}>
      {children}
    </SandpackStateContext.Provider>
  );
}

export function useSandpackState() {
  const context = useContext(SandpackStateContext);

  if (!context) {
    throw new Error(
      "Invalid usage of useSandpackState. Make sure to use it within SandpackStateProvider."
    );
  }

  return context;
}
