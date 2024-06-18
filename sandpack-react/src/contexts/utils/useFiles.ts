import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { normalizePath } from "@codesandbox/sandpack-client";
import { useEffect, useState, useRef } from "react";

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
  shouldUpdatePreview: boolean;
}

interface FilesOperations {
  openFile: (path: string) => void;
  resetFile: (path: string) => void;
  resetAllFiles: () => void;
  setActiveFile: (path: string) => void;
  updateCurrentFile: (code: string, shouldUpdatePreview?: boolean) => void;
  updateFile: (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview?: boolean
  ) => void;
  addFile: (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview?: boolean
  ) => void;
  closeFile: (path: string) => void;
  deleteFile: (path: string, shouldUpdatePreview?: boolean) => void;
}

export type UseFiles = (props: SandpackProviderProps) => [
  FilesState & {
    visibleFilesFromProps: Array<
      TemplateFiles<SandpackPredefinedTemplate> | string
    >;
  },
  FilesOperations
];

export const useFiles: UseFiles = (props) => {
  const originalStateFromProps = getSandpackStateFromProps(props);

  const [state, setState] = useState<FilesState>(originalStateFromProps);

  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      setState(getSandpackStateFromProps(props));
    } else {
      isMountedRef.current = true;
    }
  }, [props.files, props.customSetup, props.template]);

  const updateFile = (
    pathOrFiles: string | SandpackFiles,
    code?: string,
    shouldUpdatePreview = true
  ): void => {
    setState((prev) => {
      let files = prev.files;

      if (typeof pathOrFiles === "string" && typeof code === "string") {
        files = {
          ...files,
          [pathOrFiles]: {
            ...files[pathOrFiles],
            code,
          },
        };
      } else if (typeof pathOrFiles === "object") {
        files = { ...files, ...convertedFilesToBundlerFiles(pathOrFiles) };
      }

      return {
        ...prev,
        files: normalizePath(files),
        shouldUpdatePreview,
      };
    });
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
    updateCurrentFile: (code: string, shouldUpdatePreview = true): void => {
      updateFile(state.activeFile, code, shouldUpdatePreview);
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
    deleteFile: (path: string, shouldUpdatePreview = true): void => {
      setState(({ visibleFiles, files, activeFile, ...rest }) => {
        const newFiles = { ...files };
        delete newFiles[path];

        const remainingVisibleFiles = visibleFiles.filter(
          (openPath) => openPath !== path
        );
        const deletedLastVisibleFile = remainingVisibleFiles.length === 0;

        if (deletedLastVisibleFile) {
          const nextFile = Object.keys(files)[Object.keys(files).length - 1];
          return {
            ...rest,
            visibleFiles: [nextFile],
            activeFile: nextFile,
            files: newFiles,
            shouldUpdatePreview,
          };
        }

        return {
          ...rest,
          visibleFiles: remainingVisibleFiles,
          activeFile:
            path === activeFile
              ? remainingVisibleFiles[remainingVisibleFiles.length - 1]
              : activeFile,
          files: newFiles,
          shouldUpdatePreview,
        };
      });
    },
  };

  return [
    { ...state, visibleFilesFromProps: originalStateFromProps.visibleFiles },
    operations,
  ];
};
