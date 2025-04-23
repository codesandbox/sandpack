import { createContext, useContext, useEffect } from "react";
import { useCallback, useMemo, useState } from "react";

import type { SandpackProviderProps } from "../types";

import { useEnvironment } from "./SandpackEnvironmentContext";

interface SandpackState {
  activeFile: string | null;
  setActiveFile(filepath: string): void;
}

export const SandpackStateContext = createContext<SandpackState | null>(null);

export function SandpackStateProvider({
  children,
  sandbox,
}: {
  children: React.ReactNode;
  sandbox: SandpackProviderProps["sandbox"];
}) {
  const env = useEnvironment();
  const [state, setState] = useState({
    activeFile:
      typeof sandbox === "function" ? null : sandbox.activeFile || null,
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

  const value = useMemo(
    () => ({
      ...state,
      setActiveFile,
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
