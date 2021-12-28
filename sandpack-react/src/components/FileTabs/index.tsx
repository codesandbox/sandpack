import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { CloseIcon } from "../../icons";
import {
  calculateNearestUniquePath,
  getFileName,
} from "../../utils/stringUtils";

export interface FileTabsProps {
  closableTabs?: boolean;
}

/**
 * @category Components
 */
export const FileTabs = ({ closableTabs }: FileTabsProps): JSX.Element => {
  const { sandpack } = useSandpack();
  const c = useClasser("sp");

  const { activePath, openPaths, setActiveFile } = sandpack;

  const handleCloseFile = (ev: React.MouseEvent<HTMLDivElement>): void => {
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

  const getTriggerText = (currentPath: string): string => {
    const documentFileName = getFileName(currentPath);

    const pathsWithDuplicateFileNames = openPaths.reduce((prev, curr) => {
      if (curr === currentPath) {
        return prev;
      }

      const fileName = getFileName(curr);

      if (fileName === documentFileName) {
        prev.push(curr);
        return prev;
      }

      return prev;
    }, [] as string[]);

    if (pathsWithDuplicateFileNames.length === 0) {
      return documentFileName;
    } else {
      return calculateNearestUniquePath(
        currentPath,
        pathsWithDuplicateFileNames
      );
    }
  };

  return (
    <div className={c("tabs")} translate="no">
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
            onClick={(): void => setActiveFile(filePath)}
            role="tab"
            title={filePath}
            type="button"
          >
            {getTriggerText(filePath)}
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
