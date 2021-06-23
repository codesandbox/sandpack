import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import { File } from "./File";
import { ModuleList } from "./ModuleList";

export interface Props {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activePath: string;
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
    const { prefixedPath, files, selectFile, activePath, depth } = this.props;

    return (
      <div key={prefixedPath}>
        <File
          depth={depth}
          isDirOpen={this.state.open}
          onClick={this.toggleOpen}
          path={prefixedPath + "/"}
        />

        {this.state.open ? (
          <ModuleList
            activePath={activePath}
            depth={depth}
            files={files}
            prefixedPath={prefixedPath}
            selectFile={selectFile}
          />
        ) : null}
      </div>
    );
  }
}
