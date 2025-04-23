import type { DirectoryEntry } from "@codesandbox/sandpack-environments";
import * as React from "react";

import { useEnvironment } from "../../contexts/SandpackEnvironmentContext";
import type { SandpackOptions } from "../../types";

import { File } from "./File";

export interface ModuleListProps {
  path: string;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions["activeFile"]>;
  depth?: number;
  visibleFiles: NonNullable<SandpackOptions["visibleFiles"]>;
  /**
   * enable auto hidden file in file explorer
   *
   * @description set with hidden property in files property
   * @default false
   */
  autoHiddenFiles?: boolean;

  initialCollapsedFolder?: string[];
}

function join(...paths: string[]): string {
  return paths.join("/").replace(/\/+/g, "/");
}

export const ModuleList: React.FC<ModuleListProps> = ({
  depth = 0,
  activeFile,
  selectFile,
  autoHiddenFiles,
  visibleFiles,
  initialCollapsedFolder,
  path,
}) => {
  const env = useEnvironment();
  const [entries, setEntries] = React.useState<DirectoryEntry[]>([]);

  React.useEffect(() => {
    const updateEntries = () => {
      env.fs.readDirectory(path).then((entries) => {
        setEntries(entries);
      });
    };

    updateEntries();

    return env.fs.watchDirectory(path, updateEntries);
  }, []);

  const { directories, files } = React.useMemo(
    () =>
      entries.reduce<{
        directories: string[];
        files: string[];
      }>(
        (acc, entry) => {
          const { name, type } = entry;

          if (type === "directory") {
            acc.directories.push(name);
          } else {
            acc.files.push(name);
          }

          return acc;
        },
        { directories: [], files: [] }
      ),
    [entries]
  );

  return (
    <div>
      {directories.map((directoryPath) => (
        <Directory
          key={directoryPath}
          activeFile={activeFile}
          autoHiddenFiles={autoHiddenFiles}
          depth={depth}
          initialCollapsedFolder={initialCollapsedFolder}
          path={join(path, directoryPath)}
          prefixedPath={path}
          selectFile={selectFile}
          visibleFiles={visibleFiles}
        />
      ))}

      {files.map((file) => (
        <File
          key={file}
          active={activeFile === file}
          depth={depth}
          path={join(path, file)}
          selectFile={selectFile}
        />
      ))}
    </div>
  );
};

export type DirectoryProps = {
  prefixedPath: string;
  path: string;
  selectFile: (path: string) => void;
  activeFile: NonNullable<SandpackOptions["activeFile"]>;
  depth: number;
  visibleFiles: NonNullable<SandpackOptions["visibleFiles"]>;
} & Pick<ModuleListProps, "autoHiddenFiles" | "initialCollapsedFolder">;

export const Directory: React.FC<DirectoryProps> = ({
  selectFile,
  activeFile,
  depth,
  path,
  autoHiddenFiles,
  visibleFiles,
  initialCollapsedFolder,
}) => {
  const [open, setOpen] = React.useState(false);

  const toggle = (): void => setOpen((prev) => !prev);

  return (
    <div key={path}>
      <File depth={depth} isDirOpen={open} onClick={toggle} path={path} />

      {open && (
        <ModuleList
          activeFile={activeFile}
          autoHiddenFiles={autoHiddenFiles}
          depth={depth + 1}
          initialCollapsedFolder={initialCollapsedFolder}
          path={path}
          selectFile={selectFile}
          visibleFiles={visibleFiles}
        />
      )}
    </div>
  );
};
