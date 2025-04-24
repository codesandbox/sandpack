import type { SandpackEnvironmentOptions, SandpackEnvironment } from "./types";

export {
  SandpackEnvironment,
  DirectoryEntry,
  SandpackPreview,
  SandpackFileSystem,
  SandpackEnvironmentOptions,
} from "./types";

export * from "./clients/bundler";
export * from "./clients/static";
export * from "./clients/vm";

export async function loadEnvironment<T extends SandpackEnvironmentOptions>(
  options: T
): Promise<SandpackEnvironment> {
  switch (options.type) {
    case "static": {
      return import("./clients/static").then(
        (m) => new m.SandpackStaticEnvironment(options)
      );
    }
    case "bundler": {
      return import("./clients/bundler").then(
        (m) => new m.SandpackBundlerEnvironment(options)
      );
    }
    case "vm": {
      return import("./clients/vm").then(
        (m) => new m.SandpackVMEnvironment(options)
      );
    }
  }
}
