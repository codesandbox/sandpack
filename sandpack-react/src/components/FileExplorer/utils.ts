import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";

export const fromPropsToModules = ({
  enableAutoHiddenFile,
  visibleFiles,
  files,
  prefixedPath,
}: {
  prefixedPath: string;
  files: SandpackBundlerFiles;
  enableAutoHiddenFile?: boolean;
  visibleFiles: string[];
}): { directories: string[]; modules: string[] } => {
  const hasVisibleFilesOption = visibleFiles.length > 0;

  /**
   * When visibleFiles or activeFile are set, the hidden
   * and active flags on the files prop are ignored.
   * @see: https://sandpack.codesandbox.io/docs/getting-started/custom-content#visiblefiles-and-activefile
   */
  const filterByHiddenProperty = enableAutoHiddenFile && !hasVisibleFilesOption;
  const filterByVisibleFilesOption =
    enableAutoHiddenFile && !!hasVisibleFilesOption;

  const fileListWithoutPrefix = Object.keys(files)
    .filter((filePath) => {
      const isValidatedPath = filePath.startsWith(prefixedPath);
      if (filterByVisibleFilesOption) {
        return isValidatedPath && visibleFiles.includes(filePath);
      }

      if (filterByHiddenProperty) {
        return isValidatedPath && !files[filePath]?.hidden;
      }

      return isValidatedPath;
    })
    .map((file) => file.substring(prefixedPath.length));

  const directories = new Set(
    fileListWithoutPrefix
      .filter((file) => file.includes("/"))
      .map((file) => `${prefixedPath}${file.split("/")[0]}/`)
  );

  const modules = fileListWithoutPrefix
    .filter((file) => !file.includes("/"))
    .map((file) => `${prefixedPath}${file}`);

  return { directories: Array.from(directories), modules };
};
