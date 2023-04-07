import * as React from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";
import { DirectoryIconOpen, DirectoryIconClosed, FileIcon } from "../icons";

const explorerClassName = css({
  borderRadius: "0",
  width: "100%",
  padding: 0,
  marginBottom: "$space$2",

  span: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },

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
  const classNames = useClassNames();
  const onClickButton = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (selectFile) {
      selectFile(path);
    }

    onClick?.(event);
  };

  const fileName = path.split("/").filter(Boolean).pop();

  const getIcon = (): JSX.Element => {
    if (selectFile) return <FileIcon />;

    return isDirOpen ? <DirectoryIconOpen /> : <DirectoryIconClosed />;
  };

  return (
    <button
      className={classNames("button", [
        classNames("explorer"),
        buttonClassName,
        explorerClassName,
      ])}
      data-active={active}
      onClick={onClickButton}
      style={{ paddingLeft: 18 * depth + "px" }}
      title={fileName}
      type="button"
    >
      {getIcon()}
      <span>{fileName}</span>
    </button>
  );
};
