import { ClasserProvider } from "@code-hike/classer";
import * as React from "react";

import { SandpackThemeProvider } from "../styles/themeContext";
import type { SandpackContext, SandpackProviderProps } from "../types";

import { useAppState } from "./utils/useAppState";
import { useClient } from "./utils/useClient";
import { useFiles } from "./utils/useFiles";

const Sandpack = React.createContext<SandpackContext | null>(null);

export const SandpackProvider: React.FC<SandpackProviderProps> = (props) => {
  const { children, options, style, className, theme } = props;

  const [fileState, fileOperations] = useFiles(props);
  const [clientState, { dispatchMessage, addListener, ...clientOperations }] =
    useClient(props, fileState);
  const appState = useAppState(props, fileState.files);
  React.useEffect(() => {
    clientOperations.initializeSandpackIframe();
  }, []);

  return (
    <Sandpack.Provider
      value={{
        ...fileState,
        ...clientState,
        ...appState,

        ...fileOperations,
        ...clientOperations,

        autoReload: props.options?.autoReload ?? true,

        listen: addListener,
        dispatch: dispatchMessage,
      }}
    >
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

/**
 * @category Provider
 */
const SandpackConsumer = Sandpack.Consumer;

export { SandpackConsumer, Sandpack as SandpackReactContext };
