import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { stackClassName } from "../common";

import { ModuleList } from "./ModuleList";

const fileExplorerClassName = css({
  padding: "$space$3",
  overflow: "auto",
  height: "100%",
});

export interface SandpackFileExplorerProp {
  /**
   * enable auto hidden file in file explorer
   *
   * @description set with hidden property in files property
   * @default false
   */
  autoHiddenFiles?: boolean;

  initialCollapsedFolder?: string[];
}

export const SandpackFileExplorer = ({
  className,
  autoHiddenFiles = false,
  initialCollapsedFolder = [],
  ...props
}: SandpackFileExplorerProp &
  React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const {
    sandpack: {
      status,
      updateFile,
      deleteFile,
      activeFile,
      files,
      openFile,
      visibleFilesFromProps,
    },
    listen,
  } = useSandpack();
  const classNames = useClassNames();

  React.useEffect(
    function watchFSFilesChanges() {
      if (status !== "running") return;

      const unsubscribe = listen((message) => {
        if (message.type === "fs/change") {
          updateFile(message.path, message.content, false);
        }

        if (message.type === "fs/remove") {
          deleteFile(message.path, false);
        }
      });

      return unsubscribe;
    },
    [status]
  );

  const orderedFiles = Object.keys(files)
    .sort()
    .reduce<SandpackBundlerFiles>((obj, key) => {
      obj[key] = files[key];
      return obj;
    }, {});

  return (
    <div
      className={classNames("file-explorer", [stackClassName, className])}
      {...props}
    >
      <div
        className={classNames("file-explorer-list", [fileExplorerClassName])}
      >
        <ModuleList
          activeFile={activeFile}
          autoHiddenFiles={autoHiddenFiles}
          files={orderedFiles}
          initialCollapsedFolder={initialCollapsedFolder}
          prefixedPath="/"
          selectFile={openFile}
          visibleFiles={visibleFilesFromProps}
        />
      </div>
    </div>
  );
};
