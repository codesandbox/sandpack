import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { getFileName } from "../../utils/stringUtils";

export const FileTabs: React.FC = () => {
  const { sandpack } = useSandpack();
  const c = useClasser("sp");

  const { activePath, openPaths, setActiveFile } = sandpack;

  return (
    <div className={c("tabs")}>
      <div
        aria-label="Select active file"
        className={c("tabs-scrollable-container")}
        role="tablist"
      >
        {openPaths.map((filePath) => (
          <button
            key={filePath}
            aria-selected={filePath === activePath}
            className={c("tab-button")}
            data-active={filePath === activePath}
            onClick={() => setActiveFile(filePath)}
            role="tab"
            title={filePath}
            type="button"
          >
            {getFileName(filePath)}
          </button>
        ))}
      </div>
    </div>
  );
};
