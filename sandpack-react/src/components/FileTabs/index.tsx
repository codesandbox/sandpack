import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
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

const tabContainer = css({
  display: "flex",
  alignItems: "center",
  outline: "none",
  position: "relative",
  paddingRight: "20px",
  margin: "1px 0",

  "&:has(button:focus)": {
    outline: "$colors$accent auto 1px",
  },
});

const closeButtonClassName = css({
  padding: "0 $space$1 0 $space$1",
  borderRadius: "$border$radius",
  marginLeft: "$space$1",
  width: "$space$5",
  visibility: "hidden",
  cursor: "pointer",
  position: "absolute",
  right: "0px",

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

  "&:focus": {
    outline: "none",
  },
  [`&:hover ~ .${closeButtonClassName}`]: { visibility: "visible" },
});

export interface FileTabsProps {
  /**
   * This adds a close button next to each file with a unique trigger to close it.
   */
  closableTabs?: boolean;
  /**
   * unique id appended with active files. This is
   * used in aria-controls value along the combination of activeFile
   */
  activeFileUniqueId?: string;
}

/**
 * FileTabs is a list of all open files, the active file, and its state.
 */

export const FileTabs = ({
  closableTabs,
  className,
  activeFileUniqueId,
  ...props
}: FileTabsProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { sandpack } = useSandpack();
  const classNames = useClassNames();

  const { activeFile, visibleFiles, setActiveFile } = sandpack;
  const [hoveredIndex, setIsHoveredIndex] = React.useState<null | number>(null);

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

  const onKeyDown = ({
    e,
    index,
  }: {
    e: React.KeyboardEvent<HTMLElement>;
    index: number;
  }) => {
    const target = e.currentTarget as HTMLElement;

    switch (e.key) {
      case "ArrowLeft":
        {
          const leftSibling = target.previousElementSibling as HTMLElement;

          if (leftSibling) {
            leftSibling.querySelector("button")?.focus();
            setActiveFile(visibleFiles[index - 1]);
          }
        }
        break;
      case "ArrowRight":
        {
          const rightSibling = target.nextElementSibling as HTMLElement;

          if (rightSibling) {
            rightSibling.querySelector("button")?.focus();
            setActiveFile(visibleFiles[index + 1]);
          }
        }
        break;
      case "Home": {
        const parent = target.parentElement as HTMLElement;

        const firstChild = parent.firstElementChild as HTMLElement;
        firstChild.querySelector("button")?.focus();
        setActiveFile(visibleFiles[0]);
        break;
      }
      case "End": {
        const parent = target.parentElement as HTMLElement;
        const lastChild = parent.lastElementChild as HTMLElement;
        lastChild.querySelector("button")?.focus();
        setActiveFile(visibleFiles[-1]);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div
      className={classNames("tabs", [tabsClassName, className])}
      translate="no"
      {...props}
    >
      <div
        aria-label="Select active file"
        className={classNames("tabs-scrollable-container", [
          tabsScrollableClassName,
        ])}
        role="tablist"
      >
        {visibleFiles.map((filePath, index) => (
          <div
            aria-controls={`${filePath}-${activeFileUniqueId}-tab-panel`}
            aria-selected={filePath === activeFile}
            className={classNames("tab-container", [tabContainer])}
            onKeyDown={(e) => onKeyDown({ e, index })}
            onMouseEnter={() => setIsHoveredIndex(index)}
            onMouseLeave={() => setIsHoveredIndex(null)}
            role="tab"
            key={filePath}
          >
            <button
              className={classNames("tab-button", [buttonClassName, tabButton])}
              data-active={filePath === activeFile}
              id={`${filePath}-${activeFileUniqueId}-tab`}
              onClick={(): void => setActiveFile(filePath)}
              tabIndex={filePath === activeFile ? 0 : -1}
              title={filePath}
              type="button"
            >
              {getTriggerText(filePath)}
            </button>
            {closableTabs && visibleFiles.length > 1 && (
              <span
                className={classNames("close-button", [closeButtonClassName])}
                onClick={(ev) => {
                  ev.stopPropagation();

                  sandpack.closeFile(filePath);
                }}
                style={{
                  visibility:
                    filePath === activeFile || hoveredIndex === index
                      ? "visible"
                      : "hidden",
                }}
                tabIndex={filePath === activeFile ? 0 : -1}
              >
                <CloseIcon />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
