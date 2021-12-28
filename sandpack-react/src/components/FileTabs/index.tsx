import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import { CloseIcon } from "../../icons";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { getFileName } from "../../utils/stringUtils";

const tabsClassName = css({
  borderBottom: "1px solid $colors$inactiveText",
  background: "$colors$defaultBackground",
});

const tabsScrollableClassName = css({
  padding: "0 $space$4",
  overflow: "auto",
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "stretch",
  minHeight: "40px",
  marginBottom: "-1px",
});

const closeButtonClassName = css({
  padding: "0px $space$1 2px $space$1",
  borderRadius: "$border-radius",
  marginLeft: "$space$1",
  width: "20px",
  visibility: "hidden",
});

const tabButton = css({
  display: "block",
  background: "transparent",
  appearance: "none",
  fontSize: "inherit",
  padding: "0 $space$2",
  color: "$colors$defaultText",
  height: "40px",
  border: "0",
  outline: "none",
  borderBottom: "1px solid transparent",
  transition:
    "color 0.15s ease-out, border 0.15s ease-out, background 0.15s ease-out",
  whiteSpace: "nowrap",

  '&[data-active="true"]': {
    color: "$colors$activeText",
    borderBottom: "1px solid $colors$accent",
  },
  "&:hover": {
    color: "$colors$activeText",
    background: "$colors$activeBackground",
  },
  "&:focus": { outline: "none" },
  "&:focus-visible": { boxShadow: "inset 0 0 0 2px $colors$accent" },
  [`&:hover > .${closeButtonClassName}`]: { visibility: "unset" },
});

export interface FileTabsProps {
  closableTabs?: boolean;
}

/**
 * @category Components
 */
export const FileTabs = ({ closableTabs }: FileTabsProps): JSX.Element => {
  const { sandpack } = useSandpack();
  const c = useClasser(THEME_PREFIX);

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

  return (
    <div className={classNames(c("tabs"), tabsClassName)} translate="no">
      <div
        aria-label="Select active file"
        className={classNames(
          c("tabs-scrollable-container"),
          tabsScrollableClassName
        )}
        role="tablist"
      >
        {openPaths.map((filePath) => (
          <button
            key={filePath}
            aria-selected={filePath === activePath}
            className={classNames(c("tab-button"), tabButton)}
            data-active={filePath === activePath}
            onClick={(): void => setActiveFile(filePath)}
            role="tab"
            title={filePath}
            type="button"
          >
            {getFileName(filePath)}
            {closableTabs && openPaths.length > 1 ? (
              <span
                className={classNames(c("close-button"), closeButtonClassName)}
                onClick={handleCloseFile}
              >
                <CloseIcon />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};
