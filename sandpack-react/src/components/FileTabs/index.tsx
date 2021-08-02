import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { CloseIcon } from "../../icons";
import { getFileName } from "../../utils/stringUtils";

interface FileTabsProps {
  closableTabs?: boolean;
}

export const FileTabs: React.FC<FileTabsProps> = ({ closableTabs }) => {
  const { sandpack } = useSandpack();
  const c = useClasser("sp");

  const { activePath, openPaths, setActiveFile } = sandpack;

  const handleCloseFile = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    const tabElm = (ev.target as HTMLElement).closest(
      "[data-active]"
    ) as HTMLElement;
    const pathToClose = tabElm?.getAttribute("title");
    if (!pathToClose) {
      return;
    }
    sandpack.closeFile(pathToClose);
  };

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
            {closableTabs && openPaths.length > 1 ? (
              <span className={c("close-button")} onClick={handleCloseFile}>
                <CloseIcon />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};
