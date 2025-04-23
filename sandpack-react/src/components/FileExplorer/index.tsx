import * as React from "react";

import { useSandpackState } from "../../contexts/SandpackStateContext";
import { css } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { stackClassName } from "../common";

import type { ModuleListProps } from "./ModuleList";
import { ModuleList } from "./ModuleList";

const fileExplorerClassName = css({
  padding: "$space$3",
  overflow: "auto",
  height: "100%",
});

export type SandpackFileExplorerProp = Pick<
  ModuleListProps,
  "initialCollapsedFolder" | "autoHiddenFiles"
>;

export const SandpackFileExplorer = ({
  className,
  autoHiddenFiles = false,
  initialCollapsedFolder = [],
  ...props
}: SandpackFileExplorerProp &
  React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const sandpackState = useSandpackState();
  const classNames = useClassNames();

  return (
    <div
      className={classNames("file-explorer", [stackClassName, className])}
      {...props}
    >
      <div
        className={classNames("file-explorer-list", [fileExplorerClassName])}
      >
        <ModuleList
          activeFile={sandpackState?.activeFile ?? ""}
          autoHiddenFiles={autoHiddenFiles}
          initialCollapsedFolder={initialCollapsedFolder}
          path="/"
          selectFile={(filepath) => {
            sandpackState.setActiveFile(filepath);
          }}
          visibleFiles={[]}
        />
      </div>
    </div>
  );
};
