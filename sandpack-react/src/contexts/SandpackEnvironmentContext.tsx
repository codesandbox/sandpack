import type { SandpackEnvironmentOptions } from "@codesandbox/sandpack-environments";
import {
  loadEnvironment,
  type SandpackEnvironment,
} from "@codesandbox/sandpack-environments";
import type { SandpackBundlerEnvironmentOptions } from "@codesandbox/sandpack-environments/dist/clients/bundler";
import type { SandpackStaticEnvironmentOptions } from "@codesandbox/sandpack-environments/dist/clients/static";
import {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  // @ts-ignore
  use,
} from "react";

import type {
  BundlerSandbox,
  SandpackProviderProps,
  StaticSandbox,
} from "../types";

export const SandpackEnvironmentContext =
  createContext<Promise<SandpackEnvironment> | null>(null);

interface Props {
  children: React.ReactNode;
  sandbox: SandpackProviderProps["sandbox"];
  options?: {
    [K in SandpackEnvironmentOptions["type"]]: SandpackEnvironmentOptions & {
      type: K;
    };
  };
}

function loadStaticEnvironment(
  sandbox: Omit<StaticSandbox, "environment">,
  options?: SandpackStaticEnvironmentOptions
) {
  return loadEnvironment({
    type: "static",
    ...options,
    entry: sandbox.entry,
  }).then((env) => {
    const files = sandbox.files || {};

    return Promise.all(
      Object.keys(files).map((path) => env.fs.writeFile(path, files[path].code))
    ).then(() => env);
  });
}

function loadBundlerEnvironment(
  sandbox: Omit<BundlerSandbox, "environment">,
  options?: SandpackBundlerEnvironmentOptions
) {
  const pkgJson = JSON.parse(sandbox.files["package.json"]?.code ?? "{}");

  // TODO: The API currently finds the index file and loads it in the preview, but we
  // need to manually fix this
  // data.files["index.html"] = data.files["src/index.html"];

  return loadEnvironment({
    type: "bundler",
    ...options,
    entry: sandbox.entry,
    template: sandbox.template as any,
    dependencies: pkgJson.dependencies,
    devDependencies: pkgJson.devDependencies,
  }).then((env) => {
    const files = sandbox.files || {};

    return Promise.all(
      Object.keys(files).map((path) => env.fs.writeFile(path, files[path].code))
    ).then(() => env);
  });
}

export function SandpackEnvironmentProvider(props: Props) {
  const environmentRef = useRef<Promise<SandpackEnvironment> | null>(null);

  if (!environmentRef.current) {
    const environmentOptions = props.options;

    if (typeof props.sandbox === "function") {
      environmentRef.current = props.sandbox().then((sandbox) => {
        switch (sandbox.environment) {
          case "vm":
            return loadEnvironment({
              type: sandbox.environment,
              ...environmentOptions?.[sandbox.environment],
              session: sandbox.session,
            });
          case "static":
            return loadStaticEnvironment(sandbox, environmentOptions?.static);
          case "bundler": {
            return loadBundlerEnvironment(sandbox, environmentOptions?.bundler);
          }
        }
      });
    } else if (props.sandbox.template === "static") {
      environmentRef.current = loadStaticEnvironment(
        props.sandbox,
        environmentOptions?.static
      );
    } else {
      environmentRef.current = loadBundlerEnvironment(
        props.sandbox,
        environmentOptions?.bundler
      );
    }
  }

  return (
    <SandpackEnvironmentContext.Provider value={environmentRef.current}>
      {props.children}
    </SandpackEnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const envPromise = useContext(SandpackEnvironmentContext);

  if (envPromise === null) {
    throw new Error(
      `[sandpack-react]: "useSandpack" must be wrapped by a "SandpackProvider"`
    );
  }

  const env = use(envPromise) as SandpackEnvironment;

  useSyncExternalStore(
    (update) => env.onStatusChange(update),
    () => env.status
  );

  return env;
}
