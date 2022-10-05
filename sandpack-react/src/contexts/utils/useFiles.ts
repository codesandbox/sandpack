import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { normalizePath } from "@codesandbox/sandpack-client";
import isEqual from "lodash.isequal";
import { useRef, useState } from "react";

import type {
  SandboxEnvironment,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  TemplateFiles,
} from "../..";
import {
  convertedFilesToBundlerFiles,
  getSandpackStateFromProps,
} from "../../utils/sandpackUtils";

export interface FilesState {
  files: SandpackBundlerFiles;
  environment?: SandboxEnvironment;
  visibleFiles: Array<TemplateFiles<SandpackPredefinedTemplate> | string>;
  activeFile: TemplateFiles<SandpackPredefinedTemplate> | string;
}

type UseFiles = (props: SandpackProviderProps) => [
  FilesState & {
    visibleFilesFromProps: Array<
      TemplateFiles<SandpackPredefinedTemplate> | string
    >;
  },
  {
    openFile: (path: string) => void;
    resetFile: (path: string) => void;
    resetAllFiles: () => void;
    setActiveFile: (path: string) => void;
    updateCurrentFile: (code: string) => void;
    updateFile: (pathOrFiles: string | SandpackFiles, code?: string) => void;
    addFile: (pathOrFiles: string | SandpackFiles, code?: string) => void;
    closeFile: (path: string) => void;
    deleteFile: (path: string) => void;
  }
];

export const useFiles: UseFiles = (props) => {
  const originalStateFromProps = getSandpackStateFromProps(props);
  const prevOriginalStateFromProps = useRef(originalStateFromProps);

  const [state, setState] = useState<FilesState>(originalStateFromProps);

  const filesHaveChanged = !isEqual(
    prevOriginalStateFromProps.current,
    originalStateFromProps
  );
  if (filesHaveChanged) {
    setState(originalStateFromProps);

    prevOriginalStateFromProps.current = originalStateFromProps;
  }

  const updateFile = (
    pathOrFiles: string | SandpackFiles,
    code?: string
  ): void => {
    let files = state.files;

    if (typeof pathOrFiles === "string" && code) {
      if (code === state.files[pathOrFiles]?.code) {
        return;
      }

      files = {
        ...files,
        [pathOrFiles]: { code },
      };
    } else if (typeof pathOrFiles === "object") {
      files = { ...files, ...convertedFilesToBundlerFiles(pathOrFiles) };
    }

    setState((prev) => ({ ...prev, files: normalizePath(files) }));
  };

  const operations = {
    openFile: (path: string): void => {
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
    resetFile: (path: string): void => {
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
      if (state.files[activeFile]) {
        setState((prev) => ({ ...prev, activeFile }));
      }
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
  };

  return [
    { ...state, visibleFilesFromProps: originalStateFromProps.visibleFiles },
    operations,
  ];
};
