import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { DirectoryIcon, FileIcon } from "../../icons";
import { THEME_PREFIX, css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

const explorerClassName = css({
  borderRadius: "0",
  width: "100%",
  padding: 0,
  marginBottom: "$space$2",

  svg: {
    marginRight: "$space$1",
  },
});

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  depth: number;
  isDirOpen?: boolean;
}

export const File: React.FC<Props> = ({
  selectFile,
  path,
  active,
  onClick,
  depth,
  isDirOpen,
}) => {
  const c = useClasser(THEME_PREFIX);
  const onClickButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (selectFile) {
      selectFile(path);
    }

    onClick?.(event);
  };

  const fileName = path.split("/").filter(Boolean).pop();

  return (
    <button
      className={classNames(
        c("button", "explorer"),
        buttonClassName,
        explorerClassName
      )}
      data-active={active}
      onClick={onClickButton}
      style={{ paddingLeft: 18 * depth + "px" }}
      type="button"
    >
      {selectFile ? <FileIcon /> : <DirectoryIcon isOpen={isDirOpen} />}
      {fileName}
    </button>
  );
};
