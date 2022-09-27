import * as React from "react";

import { stackClassName, useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";

import { ModuleList } from "./ModuleList";

const fileExplorerClassName = {
  padding: "$space$3",
  overflow: "auto",
  height: "100%",
};

export interface SandpackFileExplorerProp {
  /**
   * enable auto hidden file in file explorer
   *
   * @description set with hidden property in files property
   * @default false
   */
  autoHiddenFiles?: boolean;
}

/**
 * @category Components
 */
export const SandpackFileExplorer = ({
  className,
  autoHiddenFiles = false,
  ...props
}: SandpackFileExplorerProp &
  React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const { sandpack } = useSandpack();
  const { css } = useSandpackTheme();

  return (
    <div
      className={classNames(
        css(stackClassName),
        css(fileExplorerClassName),
        `${THEME_PREFIX}-file-explorer`,
        className
      )}
      {...props}
    >
      <ModuleList
        activeFile={sandpack.activeFile}
        autoHiddenFiles={autoHiddenFiles}
        files={sandpack.files}
        prefixedPath="/"
        selectFile={sandpack.openFile}
        visibleFiles={sandpack.visibleFilesFromProps}
      />
    </div>
  );
};
