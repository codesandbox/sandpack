import type {
  SandpackBundlerFile,
  SandpackBundlerFiles,
} from "@codesandbox/sandpack-client";
import { addPackageJSONIfNeeded } from "@codesandbox/sandpack-client";

import { SANDBOX_TEMPLATES } from "../templates";
import type {
  SandpackProviderState,
  SandboxTemplate,
  SandpackPredefinedTemplate,
  SandpackProviderProps,
  SandpackSetup,
} from "../types";

type SandpackContextInfo = Pick<
  SandpackProviderState,
  "activePath" | "openPaths" | "files" | "environment"
>;

export const getSandpackStateFromProps = (
  props: SandpackProviderProps
): SandpackContextInfo => {
  /**
   * Combine files with customSetup to create the user input structure
   */
  const userInputSetup = props.files
    ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          ...props.files,
        },
      }
    : props.customSetup;

  if (props.files && props.customSetup?.files) {
    console.warn("TODO: don't use both");
  }

  const internalTemplate =
    typeof props.template === "string" ? props.template : undefined;

  // Merge predefined template with custom setup
  const projectSetup = getSetup(internalTemplate, userInputSetup);

  // openPaths and activePath override the setup flags
  let openPaths = props.options?.openPaths ?? [];
  let activePath = props.options?.activePath;

  if (openPaths.length === 0 && userInputSetup?.files) {
    const inputFiles = userInputSetup.files;

    // extract open and active files from the custom input files
    Object.keys(inputFiles).forEach((filePath) => {
      const file = inputFiles[filePath];
      if (typeof file === "string") {
        openPaths.push(filePath);
        return;
      }

      if (!activePath && file.active) {
        activePath = filePath;
        if (file.hidden === true) {
          openPaths.push(filePath); // active file needs to be available even if someone sets it as hidden by accident
        }
      }

      if (!file.hidden) {
        openPaths.push(filePath);
      }
    });
  }

  if (openPaths.length === 0) {
    // If no files are received, use the project setup / template
    openPaths = Object.keys(projectSetup.files).reduce<string[]>((acc, key) => {
      if (!projectSetup.files[key].hidden) {
        acc.push(key);
      }

      return acc;
    }, []);
  }

  // Make sure it resolves the entry file
  if (!projectSetup.files[projectSetup.entry]) {
    /* eslint-disable */
    // @ts-ignore
    projectSetup.entry = resolveFile(projectSetup.entry, projectSetup.files);
    /* eslint-enable */
  }

  // Make sure it resolves the main file
  if (!projectSetup.files[projectSetup.main]) {
    projectSetup.main =
      resolveFile(projectSetup.main, projectSetup.files) || projectSetup.entry;
  }

  // If no activePath is specified, use the first open file
  if (!activePath || !projectSetup.files[activePath]) {
    activePath = projectSetup.main || openPaths[0];
  }

  // If for whatever reason the active path was not set as open, set it
  if (!openPaths.includes(activePath)) {
    openPaths.push(activePath);
  }

  const files = addPackageJSONIfNeeded(
    projectSetup.files,
    projectSetup.dependencies || {},
    projectSetup.devDependencies || {},
    projectSetup.entry
  );

  const existOpenPath = openPaths.filter((path) => files[path]);

  return {
    openPaths: existOpenPath,
    activePath,
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
export const getSetup = (
  template?: SandpackPredefinedTemplate,
  inputSetup?: SandpackSetup
): SandboxTemplate => {
  /**
   * The input setup might have files in the simple form Record<string, string>
   * so we convert them to the sandbox template format
   */
  const setup = createSetupFromUserInput(inputSetup);

  if (!template) {
    // If not input, default to vanilla
    if (!setup) {
      return SANDBOX_TEMPLATES.vanilla;
    }

    if (!setup.files || Object.keys(setup.files).length === 0) {
      throw new Error(
        `When using the customSetup without a template, you must pass at least one file for sandpack to work`
      );
    }

    // If not template specified, use the setup entirely
    return setup as SandboxTemplate;
  }

  const baseTemplate = SANDBOX_TEMPLATES[template];
  if (!baseTemplate) {
    throw new Error(`Invalid template '${template}' provided.`);
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
  };
};

export const createSetupFromUserInput = (
  setup?: SandpackSetup
): Partial<SandboxTemplate> | null => {
  if (!setup) {
    return null;
  }

  if (!setup.files) {
    return setup as Partial<SandboxTemplate>;
  }

  const { files } = setup;

  const convertedFiles = Object.keys(files).reduce(
    (acc: SandpackBundlerFiles, key) => {
      if (typeof files[key] === "string") {
        acc[key] = { code: files[key] as string };
      } else {
        acc[key] = files[key] as SandpackBundlerFile;
      }

      return acc;
    },
    {}
  );

  return {
    ...setup,
    files: convertedFiles,
  };
};
