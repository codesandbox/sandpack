import type {
  SandpackBundlerFile,
  SandpackBundlerFiles,
} from "@codesandbox/sandpack-client";
import { addPackageJSONIfNeeded } from "@codesandbox/sandpack-client";

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
}

export const getSandpackStateFromProps = (
  props: SandpackProviderProps
): SandpackContextInfo => {
  // Merge predefined template with custom setup
  const projectSetup = getSetup({
    template: props.template,
    customSetup: props.customSetup,
    files: props.files,
  });

  // visibleFiles and activeFile override the setup flags
  let visibleFiles = props.options?.visibleFiles ?? [];
  let activeFile = props.options?.activeFile;

  if (visibleFiles.length === 0 && props?.files) {
    const inputFiles = props.files;

    // extract open and active files from the custom input files
    Object.keys(inputFiles).forEach((filePath) => {
      const file = inputFiles[filePath];
      if (typeof file === "string") {
        visibleFiles.push(filePath);
        return;
      }

      if (!activeFile && file.active) {
        activeFile = filePath;
        if (file.hidden === true) {
          visibleFiles.push(filePath); // active file needs to be available even if someone sets it as hidden by accident
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
  if (!projectSetup.files[projectSetup.entry]) {
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
    activeFile,
    files,
    environment: projectSetup.environment,
  };
};

export const resolveFile = (
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: Record<string, any>
): string | undefined => {
  if (!path) return undefined;

  let resolvedPath = undefined;

  let index = 0;
  const strategies = [".js", ".jsx", ".ts", ".tsx"];
  const leadingSlash = Object.keys(files).every((file) => file.startsWith("/"));

  while (!resolvedPath && index < strategies.length) {
    const slashPath = (): string => {
      if (path.startsWith("/")) {
        return leadingSlash ? path : path.replace(/^\/+/, "");
      }

      return leadingSlash ? `/${path}` : path;
    };
    const removeExtension = slashPath().split(".")[0];
    const attemptPath = `${removeExtension}${strategies[index]}`;

    if (files[attemptPath] !== undefined) {
      resolvedPath = attemptPath;
    }

    index++;
  }

  return resolvedPath;
};

/**
 * The template is predefined (eg: react, vue, vanilla)
 * The setup can overwrite anything from the template (eg: files, dependencies, environment, etc.)
 */
export const getSetup = ({
  files,
  template,
  customSetup,
}: {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
}): SandboxTemplate => {
  /**
   * The input setup might have files in the simple form Record<string, string>
   * so we convert them to the sandbox template format
   */
  const setup = createSetupFromUserInput({ customSetup, files });

  if (!template) {
    // If not input, default to vanilla
    if (!setup) {
      return SANDBOX_TEMPLATES.vanilla as SandboxTemplate;
    }

    if (!setup.files || Object.keys(setup.files).length === 0) {
      throw new Error(
        `[sandpack-react]: without a template, you must pass at least one file`
      );
    }

    // If not template specified, use the setup entirely
    return setup as SandboxTemplate;
  }

  const baseTemplate = SANDBOX_TEMPLATES[template] as SandboxTemplate;
  if (!baseTemplate) {
    throw new Error(
      `[sandpack-react]: invalid template "${template}" provided`
    );
  }

  // If no setup, the template is used entirely
  if (!setup) {
    return baseTemplate;
  }

  // Merge the setup on top of the template
  return {
    files: { ...baseTemplate.files, ...setup.files },
    dependencies: {
      ...baseTemplate.dependencies,
      ...setup.dependencies,
    },
    devDependencies: {
      ...baseTemplate.devDependencies,
      ...setup.devDependencies,
    },
    entry: setup.entry || baseTemplate.entry,
    main: setup.main || baseTemplate.main,
    environment: setup.environment || baseTemplate.environment,
  } as SandboxTemplate;
};

export const convertedFilesToBundlerFiles = (
  files: SandpackFiles
): SandpackBundlerFiles => {
  return Object.keys(files).reduce((acc: SandpackBundlerFiles, key) => {
    if (typeof files[key] === "string") {
      acc[key] = { code: files[key] as string };
    } else {
      acc[key] = files[key] as SandpackBundlerFile;
    }

    return acc;
  }, {});
};

export const createSetupFromUserInput = ({
  files,
  customSetup,
}: {
  files?: SandpackFiles;
  customSetup?: SandpackSetup;
}): Partial<SandboxTemplate> | null => {
  if (!files && !customSetup) {
    return null;
  }

  if (!files) {
    return customSetup as Partial<SandboxTemplate>;
  }

  const convertedFiles = convertedFilesToBundlerFiles(files);

  return {
    ...customSetup,
    files: convertedFiles,
  };
};
