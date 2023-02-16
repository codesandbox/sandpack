import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import {
  calculateNearestUniquePath,
  getFileName,
} from "../../utils/stringUtils";
import { CloseIcon } from "../icons";

const tabsClassName = css({
  borderBottom: "1px solid $colors$surface2",
  background: "$colors$surface1",
});

const tabsScrollableClassName = css({
  padding: "0 $space$2",
  overflow: "auto",
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "stretch",
  minHeight: "40px",
  marginBottom: "-1px",
});

const closeButtonClassName = css({
  padding: "0 $space$1 0 $space$1",
  borderRadius: "$border$radius",
  marginLeft: "$space$1",
  width: "$space$5",
  visibility: "hidden",

  svg: {
    width: "$space$3",
    height: "$space$3",
    display: "block",
    position: "relative",
    top: 1,
  },
});

export const tabButton = css({
  padding: "0 $space$2",
  height: "$layout$headerHeight",
  whiteSpace: "nowrap",

  "&:focus": { outline: "none" },
  [`&:hover > .${closeButtonClassName}`]: { visibility: "unset" },
});

export interface FileTabsProps {
  /**
   * This adds a close button next to each file with a unique trigger to close it.
   */
  closableTabs?: boolean;
}

/**
 * FileTabs is a list of all open files, the active file, and its state.
 */

export const FileTabs = ({
  closableTabs,
  className,
  ...props
}: FileTabsProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { sandpack } = useSandpack();
  const c = useClasser(THEME_PREFIX);

  const { activeFile, visibleFiles, setActiveFile } = sandpack;

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

    const pathsWithDuplicateFileNames = visibleFiles.reduce((prev, curr) => {
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
    <div
      className={classNames(c("tabs"), tabsClassName, className)}
      translate="no"
      {...props}
    >
      <div
        aria-label="Select active file"
        className={classNames(
          c("tabs-scrollable-container"),
          tabsScrollableClassName
        )}
        role="tablist"
      >
        {visibleFiles.map((filePath) => (
          <button
            key={filePath}
            aria-selected={filePath === activeFile}
            className={classNames(c("tab-button"), buttonClassName, tabButton)}
            data-active={filePath === activeFile}
            onClick={(): void => setActiveFile(filePath)}
            role="tab"
            title={filePath}
            type="button"
          >
            {getTriggerText(filePath)}
            {closableTabs && visibleFiles.length > 1 && (
              <span
                className={classNames(c("close-button"), closeButtonClassName)}
                onClick={handleCloseFile}
              >
                <CloseIcon />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
