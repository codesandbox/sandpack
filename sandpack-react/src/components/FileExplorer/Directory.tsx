import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import { File } from "./File";
import { ModuleList } from "./ModuleList";

import type { SandpackFileExplorerProp } from ".";

export interface Props extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: string;
  depth: number;
}

interface State {
  open: boolean;
}

export class Directory extends React.Component<Props, State> {
  state = {
    open: true,
  };

  toggleOpen = (): void => {
    this.setState((state) => ({ open: !state.open }));
  };

  render(): React.ReactElement {
    const {
      prefixedPath,
      files,
      selectFile,
      activeFile,
      depth,
      enableAutoHiddenFile,
    } = this.props;

    return (
      <div key={prefixedPath}>
        <File
          depth={depth}
          isDirOpen={this.state.open}
          onClick={this.toggleOpen}
          path={prefixedPath + "/"}
        />

        {this.state.open && (
          <ModuleList
            activeFile={activeFile}
            depth={depth + 1}
            enableAutoHiddenFile={enableAutoHiddenFile}
            files={files}
            prefixedPath={prefixedPath}
            selectFile={selectFile}
          />
        )}
      </div>
    );
  }
}
