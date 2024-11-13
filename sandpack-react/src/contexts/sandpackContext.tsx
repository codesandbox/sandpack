import * as React from "react";

import { SandpackThemeProvider } from "../styles/themeContext";
import type { SandpackContext, SandpackProviderProps } from "../types";
import { ClassNamesProvider } from "../utils/classNames";

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

  React.useEffect(
    function watchFSFilesChanges() {
      if (clientState.status !== "running") return;

      const unsubscribe = addListener((message) => {
        if (message.type === "fs/change") {
          fileOperations.updateFile(message.path, message.content, false);
        }

        if (message.type === "fs/remove") {
          fileOperations.deleteFile(message.path, false);
        }
      });

      return unsubscribe;
    },
    [clientState.status]
  );

  return (
    <Sandpack.Provider
      value={{
        ...fileState,
        ...clientState,
        ...appState,

        ...fileOperations,
        ...clientOperations,

        autoReload: props.options?.autoReload ?? true,
        teamId: props?.teamId,
        exportOptions: props?.customSetup?.exportOptions,

        listen: addListener,
        dispatch: dispatchMessage,
      }}
    >
      <ClassNamesProvider classes={options?.classes}>
        <SandpackThemeProvider
          className={className}
          style={style}
          theme={theme}
        >
          {children}
        </SandpackThemeProvider>
      </ClassNamesProvider>
    </Sandpack.Provider>
  );
};

/**
 * @category Provider
 */
const SandpackConsumer = Sandpack.Consumer;

export { SandpackConsumer, Sandpack as SandpackReactContext };
