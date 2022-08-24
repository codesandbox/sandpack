import * as React from "react";
import { ClasserProvider } from "@code-hike/classer";
import { SandpackThemeProvider } from "../contexts/themeContext";

import type {
  SandpackContext,
  SandpackInternalProvider,
  SandpackProviderState,
  SandpackProviderProps,
} from "../types";

const Sandpack = React.createContext<SandpackContext | null>(null);

export const SandpackProvider: React.FC<SandpackProviderProps> = ({
  children,
  options,
}) => {
  return (
    <Sandpack.Provider value={{}}>
      <ClasserProvider classes={options?.classes}>
        <SandpackThemeProvider
          className={className}
          style={style}
          theme={theme}
        >
          {children}
        </SandpackThemeProvider>
      </ClasserProvider>
    </Sandpack.Provider>
  );
};