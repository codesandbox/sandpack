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
    sandpack: { activeFile, files, openFile, visibleFilesFromProps },
  } = useSandpack();
  const classNames = useClassNames();

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
