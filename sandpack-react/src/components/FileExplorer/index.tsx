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
export const FileExplorer = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const { sandpack } = useSandpack();

  return (
    <div className={classNames(fileExplorerClassName, className)}>
      <ModuleList
        activePath={sandpack.activePath}
        files={sandpack.files}
        prefixedPath="/"
        selectFile={sandpack.openFile}
      />
    </div>
  );
};
