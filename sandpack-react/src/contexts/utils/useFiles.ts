import type { EditorState } from "@codemirror/state";
import type {
  BundlerState,
  ReactDevToolsMode,
  SandpackBundlerFiles,
  SandpackError,
} from "@codesandbox/sandpack-client";
import { useState } from "react";

import type {
  SandboxEnvironment,
  SandpackFiles,
  SandpackInitMode,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  SandpackStatus,
  TemplateFiles,
} from "../..";
import {
  convertedFilesToBundlerFiles,
  getSandpackStateFromProps,
} from "../../utils/sandpackUtils";

interface SandpackProviderState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  visibleFiles: Array<TemplateFiles<SandpackPredefinedTemplate> | string>;
  activeFile: TemplateFiles<SandpackPredefinedTemplate> | string;
}

interface SandpackConfigState {
  sandpackStatus: SandpackStatus;
  editorState: EditorState;
  reactDevTools?: ReactDevToolsMode;
  startRoute?: string;
  initMode: SandpackInitMode;
  bundlerState?: BundlerState;
  error: SandpackError | null;
}

type UseFiles = (props: SandpackProviderProps) => {
  state: SandpackProviderState & {
    visibleFilesFromProps: Array<
      TemplateFiles<SandpackPredefinedTemplate> | string
    >;
  };
  operations: {
    openFile: (path: string) => void;
    resetFile: (path: string) => void;
    resetAllFiles: () => void;
    setActiveFile: (path: string) => void;
    updateCurrentFile: (code: string) => void;
    updateFile: (pathOrFiles: string | SandpackFiles, code?: string) => void;
    addFile: (pathOrFiles: string | SandpackFiles, code?: string) => void;
    closeFile: (path: string) => void;
    deleteFile: (path: string) => void;
  };
};

export const useFiles: UseFiles = (props) => {
  const originalStateFromProps = getSandpackStateFromProps(props);
  const { visibleFiles, ...rest } = originalStateFromProps;

  const [state, setState] = useState<SandpackProviderState>({
    ...rest,
    visibleFiles,
  });

  const updateFile = (
    pathOrFiles: string | SandpackFiles,
    code?: string
  ): void => {
    let files = state.files;

    if (typeof pathOrFiles === "string" && code) {
      if (code === state.files[pathOrFiles]?.code) {
        return;
      }

      files = { ...files, [pathOrFiles]: { code: code } };
    } else if (typeof pathOrFiles === "object") {
      files = { ...files, ...convertedFilesToBundlerFiles(pathOrFiles) };
    }

    setState((prev) => ({ ...prev, files }));
  };

  return {
    state: { ...state, visibleFilesFromProps: visibleFiles },
    operations: {
      openFile: (path): void => {
        setState(({ visibleFiles, ...rest }) => {
          const newPaths = visibleFiles.includes(path)
            ? visibleFiles
            : [...visibleFiles, path];

          return {
            ...rest,
            activeFile: path,
            visibleFiles: newPaths,
          };
        });
      },
      resetFile: (path): void => {
        setState((prevState) => ({
          ...prevState,
          files: {
            ...prevState.files,
            [path]: originalStateFromProps.files[path],
          },
        }));
      },
      resetAllFiles: (): void => {
        setState((prev) => ({ ...prev, files: originalStateFromProps.files }));
      },
      setActiveFile: (activeFile: string): void => {
        setState((prev) => ({ ...prev, activeFile }));
      },
      updateCurrentFile: (code: string): void => {
        updateFile(state.activeFile, code);
      },
      updateFile,
      addFile: updateFile,
      closeFile: (path: string): void => {
        if (state.visibleFiles.length === 1) {
          return;
        }

        setState(({ visibleFiles, activeFile, ...prev }) => {
          const indexOfRemovedPath = visibleFiles.indexOf(path);
          const newPaths = visibleFiles.filter((openPath) => openPath !== path);

          return {
            ...prev,
            activeFile:
              path === activeFile
                ? indexOfRemovedPath === 0
                  ? visibleFiles[1]
                  : visibleFiles[indexOfRemovedPath - 1]
                : activeFile,
            visibleFiles: newPaths,
          };
        });
      },
      deleteFile: (path: string): void => {
        setState(({ visibleFiles, files, ...rest }) => {
          const newFiles = { ...files };
          delete newFiles[path];

          return {
            ...rest,
            visibleFiles: visibleFiles.filter((openPath) => openPath !== path),
            files: newFiles,
          };
        });
      },
    },
  };
};