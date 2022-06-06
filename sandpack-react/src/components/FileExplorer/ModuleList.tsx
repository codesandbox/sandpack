import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import * as React from "react";

import type { SandpackContext } from "../..";
import { SandpackReactContext } from "../../contexts/sandpackContext";

import { Directory } from "./Directory";
import { File } from "./File";

import type { SandpackFileExplorerProp } from ".";

export interface Props extends SandpackFileExplorerProp {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  selectFile: (path: string) => void;
  activeFile: string;
  depth?: number;
}

export class ModuleList extends React.PureComponent<Props> {
  static contextType = SandpackReactContext;

  render(): JSX.Element {
    const {
      depth = 0,
      activeFile,
      selectFile,
      prefixedPath,
      files,
      enableAutoHiddenFile,
    } = this.props;

    let fileListWithoutPrefix: string[] = [];
    const { visibleFiles = [] } = this.context as SandpackContext;
    const hasVisibleFilesOption = visibleFiles.length > 0;

    // When visibleFiles or activeFile are set, the hidden and active flags on the files prop are ignored.
    // see: https://sandpack.codesandbox.io/docs/getting-started/custom-content#visiblefiles-and-activefile
    const filterByHiddenProperty =
      enableAutoHiddenFile && !hasVisibleFilesOption;
    const filterByVisibleFilesOption =
      enableAutoHiddenFile && !!hasVisibleFilesOption;

    fileListWithoutPrefix = Object.keys(files)
      .filter((filePath) => {
        const isValidatedPath = filePath.startsWith(prefixedPath);
        if (filterByVisibleFilesOption) {
          return isValidatedPath && visibleFiles.includes(filePath);
        }
        if (filterByHiddenProperty) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return isValidatedPath && !(files[filePath] as any).hidden;
        }
        return isValidatedPath;
      })
      .map((file) => file.substring(prefixedPath.length));

    const directoriesToShow = new Set(
      fileListWithoutPrefix
        .filter((file) => file.includes("/"))
        .map((file) => `${prefixedPath}${file.split("/")[0]}/`)
    );

    const filesToShow = fileListWithoutPrefix
      .filter((file) => !file.includes("/"))
      .map((file) => ({ path: `${prefixedPath}${file}` }));

    return (
      <div>
        {Array.from(directoriesToShow).map((dir) => (
          <Directory
            key={dir}
            activeFile={activeFile}
            depth={depth}
            enableAutoHiddenFile={enableAutoHiddenFile}
            files={files}
            prefixedPath={dir}
            selectFile={selectFile}
          />
        ))}

        {filesToShow.map((file) => (
          <File
            key={file.path}
            active={activeFile === file.path}
            depth={depth}
            path={file.path}
            selectFile={this.props.selectFile}
          />
        ))}
      </div>
    );
  }
}
