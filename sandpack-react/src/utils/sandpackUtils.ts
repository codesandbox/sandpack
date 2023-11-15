import type {
  SandpackBundlerFile,
  SandpackBundlerFiles,
} from "@codesandbox/sandpack-client";
import {
  addPackageJSONIfNeeded,
  normalizePath,
} from "@codesandbox/sandpack-client";

import { SANDBOX_TEMPLATES } from "../templates";
import type {
  SandboxTemplate,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  SandpackSetup,
  SandpackFiles,
  SandboxEnvironment,
} from "../types";

export interface SandpackContextInfo {
  activeFile: string;
  visibleFiles: string[];
  files: Record<string, SandpackBundlerFile>;
  environment: SandboxEnvironment;
  shouldUpdatePreview: true;
}

/**
 * Creates a standard sandpack state given the setup,
 * options, and files props. Using this function is
 * the reliable way to ensure a consistent and predictable
 * sandpack-content throughout application
 */
export const getSandpackStateFromProps = (
  props: SandpackProviderProps
): SandpackContextInfo => {
  const normalizedFilesPath = normalizePath(props.files);

  // Merge predefined template with custom setup
  const projectSetup = combineTemplateFilesToSetup({
    template: props.template,
    customSetup: props.customSetup,
    files: normalizedFilesPath,
  });

  // visibleFiles and activeFile override the setup flags
  let visibleFiles: string[] = normalizePath(props.options?.visibleFiles ?? []);
  let activeFile = props.options?.activeFile
    ? resolveFile(props.options?.activeFile, projectSetup.files)
    : undefined;

  if (visibleFiles.length === 0 && normalizedFilesPath) {
    // extract open and active files from the custom input files
    Object.keys(normalizedFilesPath).forEach((filePath) => {
      const file = normalizedFilesPath[filePath];
      if (typeof file === "string") {
        visibleFiles.push(filePath);
        return;
      }

      if (!activeFile && file.active) {
        activeFile = filePath;
        if (file.hidden === true) {
          // active file needs to be available even if someone sets it as hidden by accident
          visibleFiles.push(filePath);
        }
      }

      if (!file.hidden) {
        visibleFiles.push(filePath);
      }
    });
  }

  if (visibleFiles.length === 0) {
    // If no files are received, use the project setup / template
    visibleFiles = [projectSetup.main];
  }

  // Make sure it resolves the entry file
  if (projectSetup.entry && !projectSetup.files[projectSetup.entry]) {
    /* eslint-disable */
    // @ts-ignore
    projectSetup.entry = resolveFile(projectSetup.entry, projectSetup.files);
    /* eslint-enable */
  }

  if (!activeFile && projectSetup.main) {
    activeFile = projectSetup.main;
  }

  // If no activeFile is specified, use the first open file
  if (!activeFile || !projectSetup.files[activeFile]) {
    activeFile = visibleFiles[0];
  }

  // If for whatever reason the active path was not set as open, set it
  if (!visibleFiles.includes(activeFile)) {
    visibleFiles.push(activeFile);
  }

  const files = addPackageJSONIfNeeded(
    projectSetup.files,
    projectSetup.dependencies ?? {},
    projectSetup.devDependencies ?? {},
    projectSetup.entry
  );

  const existOpenPath = visibleFiles.filter((path) => files[path]);

  return {
    visibleFiles: existOpenPath,
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    activeFile: activeFile!,
    files,
    environment: projectSetup.environment,
    shouldUpdatePreview: true,
  };
};

/**
 * Given a file tree and a file, it uses a couple of rules
 * to tweak the filename to match with one of the inside of file tree
 *
 * - Adds the leading slash;
 * - Tries to find the same filename with different extensions (js only);
 * - Returns `null` if it doesn't satisfy any rule
 */
export const resolveFile = (
  path: string,
  files: SandpackFiles
): string | null => {
  const normalizedFilesPath = normalizePath(files);
  const normalizedPath = normalizePath(path);

  if (normalizedPath in normalizedFilesPath) {
    return normalizedPath;
  }

  if (!path) {
    return null;
  }

  let resolvedPath = null;
  let index = 0;
  const strategies = [".js", ".jsx", ".ts", ".tsx"];

  while (!resolvedPath && index < strategies.length) {
    const removeExtension = normalizedPath.split(".")[0];
    const attemptPath = `${removeExtension}${strategies[index]}`;

    if (normalizedFilesPath[attemptPath] !== undefined) {
      resolvedPath = attemptPath;
    }

    index++;
  }

  return resolvedPath;
};

/**
 * The template is predefined (eg: react, vue, vanilla)
 * The setup can overwrite anything from the template
 * (eg: files, dependencies, environment, etc.)
 */
const combineTemplateFilesToSetup = ({
  files,
  template,
  customSetup,
}: {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
}): SandboxTemplate => {
  if (!template) {
    // If not input, default to vanilla
    if (!customSetup) {
      const defaultTemplate =
        SANDBOX_TEMPLATES.vanilla as unknown as SandboxTemplate;

      return {
        ...defaultTemplate,
        files: {
          ...defaultTemplate.files,
          ...convertedFilesToBundlerFiles(files),
        },
      } as unknown as SandboxTemplate;
    }

    if (!files || Object.keys(files).length === 0) {
      throw new Error(
        `[sandpack-react]: without a template, you must pass at least one file`
      );
    }

    // If not template specified, use the setup entirely
    return {
      ...customSetup,
      files: convertedFilesToBundlerFiles(files),
    } as SandboxTemplate;
  }

  const baseTemplate = SANDBOX_TEMPLATES[
    template
  ] as unknown as SandboxTemplate;
  if (!baseTemplate) {
    throw new Error(
      `[sandpack-react]: invalid template "${template}" provided`
    );
  }

  // If no setup and not files, the template is used entirely
  if (!customSetup && !files) {
    return baseTemplate;
  }

  // Merge the setup on top of the template
  return {
    /**
     * The input setup might have files in the simple form Record<string, string>
     * so we convert them to the sandbox template format
     */
    files: convertedFilesToBundlerFiles({ ...baseTemplate.files, ...files }),
    /**
     * Merge template dependencies and user custom dependencies.
     * As a rule, the custom dependencies must overwrite the template ones.
     */
    dependencies: {
      ...baseTemplate.dependencies,
      ...customSetup?.dependencies,
    },
    devDependencies: {
      ...baseTemplate.devDependencies,
      ...customSetup?.devDependencies,
    },
    entry: normalizePath(customSetup?.entry),
    main: baseTemplate.main,
    environment: customSetup?.environment || baseTemplate.environment,
  } as SandboxTemplate;
};

/**
 * Transform an regular object, which contain files to
 * an object that sandpack-client can understand
 *
 * From: Record<string, string>
 * To: Record<string, { code: string }>
 */
export const convertedFilesToBundlerFiles = (
  files?: SandpackFiles
): SandpackBundlerFiles => {
  if (!files) return {};

  return Object.keys(files).reduce((acc: SandpackBundlerFiles, key) => {
    if (typeof files[key] === "string") {
      acc[key] = { code: files[key] as string };
    } else {
      acc[key] = files[key] as SandpackBundlerFile;
    }

    return acc;
  }, {});
};
