import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
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
}

export const SandpackFileExplorer = ({
  className,
  autoHiddenFiles = false,
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

  return (
    <div
      className={classNames(
        stackClassName,
        fileExplorerClassName,
        `${THEME_PREFIX}-file-explorer`,
        className
      )}
      {...props}
    >
      <ModuleList
        activeFile={activeFile}
        autoHiddenFiles={autoHiddenFiles}
        files={files}
        prefixedPath="/"
        selectFile={openFile}
        visibleFiles={visibleFilesFromProps}
      />
    </div>
  );
};
