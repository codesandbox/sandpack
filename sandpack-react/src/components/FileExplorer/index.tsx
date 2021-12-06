import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";

import { ModuleList } from "./ModuleList";

// WIP
/**
 * @category Components
 */
export const FileExplorer = (): JSX.Element => {
  const { sandpack } = useSandpack();

  return (
    <div>
      <ModuleList
        activePath={sandpack.activePath}
        files={sandpack.files}
        prefixedPath="/"
        selectFile={sandpack.openFile}
      />
    </div>
  );
};
