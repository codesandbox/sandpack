import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import { ModuleList } from "./ModuleList";

const fileExplorerClassName = css({
  padding: "$space$3",
  overflow: "auto",
  height: "100%",
});

/**
 * @category Components
 */
export const SandpackFileExplorer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element | null => {
  const { sandpack } = useSandpack();

  return (
    <div className={classNames(fileExplorerClassName, className)} {...props}>
      <ModuleList
        activeFile={sandpack.activeFile}
        files={sandpack.files}
        prefixedPath="/"
        selectFile={sandpack.openFile}
      />
    </div>
  );
};
