import * as React from "react";

import { DirectoryIcon, FileIcon } from "../../icons";

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  depth: number;
  isDirOpen?: boolean;
}

export class File extends React.PureComponent<Props> {
  selectFile = (): void => {
    if (this.props.selectFile) {
      this.props.selectFile(this.props.path);
    }
  };

  render(): React.ReactElement {
    const fileName = this.props.path.split("/").filter(Boolean).pop();

    return (
      <button
        className="sp-button sp-explorer"
        data-active={this.props.active}
        onClick={this.props.selectFile ? this.selectFile : this.props.onClick}
        style={{ paddingLeft: 8 * this.props.depth + "px" }}
        type="button"
      >
        {this.props.selectFile ? (
          <FileIcon />
        ) : (
          <DirectoryIcon isOpen={this.props.isDirOpen} />
        )}
        {fileName}
      </button>
    );
  }
}
