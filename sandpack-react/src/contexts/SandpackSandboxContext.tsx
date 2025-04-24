import type {
  SandpackEnvironmentOptions,
  SandpackStaticEnvironmentOptions,
} from "@codesandbox/sandpack-environments";
import {
  loadEnvironment,
  type SandpackEnvironment,
} from "@codesandbox/sandpack-environments";
import type { SandpackBundlerEnvironmentOptions } from "@codesandbox/sandpack-environments/dist/clients/bundler";
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
  Sandbox,
  SandpackProviderProps,
  StaticSandbox,
} from "../types";

interface ContextValue {
  environment: SandpackEnvironment;
  sandbox: Sandbox;
}

export const SandpackSandboxContext =
  createContext<Promise<ContextValue> | null>(null);

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
  sandbox: StaticSandbox,
  options?: SandpackStaticEnvironmentOptions
) {
  return loadEnvironment({
    type: "static",
    ...options,
    entry: sandbox.entry,
  }).then((env) => {
    const files = sandbox.files || {};

    return Promise.all(
      Object.keys(files).map((path) => {
        env.fs.writeFileMetadata(path, files[path].metadata);
        return env.fs.writeFile(path, files[path].code);
      })
    ).then(() => env);
  });
}

function loadBundlerEnvironment(
  sandbox: BundlerSandbox,
  options?: SandpackBundlerEnvironmentOptions
) {
  return loadEnvironment({
    type: "bundler",
    ...options,
    entry: sandbox.entry,
    bundlerType: sandbox.bundler,
  }).then((env) => {
    const files = sandbox.files || {};

    return Promise.all(
      Object.keys(files).map((path) => {
        env.fs.writeFileMetadata(path, files[path].metadata);
        return env.fs.writeFile(path, files[path].code);
      })
    ).then(() => env);
  });
}

export function SandpackSandboxProvider(props: Props) {
  const sandboxRef = useRef<Promise<ContextValue> | null>(null);

  if (!sandboxRef.current) {
    const environmentOptions = props.options;

    if (typeof props.sandbox === "function") {
      sandboxRef.current = props.sandbox().then((sandbox) => {
        switch (sandbox.environment) {
          case "vm":
            return loadEnvironment({
              type: sandbox.environment,
              ...environmentOptions?.[sandbox.environment],
              session: sandbox.session,
            }).then((environment) => ({ environment, sandbox }));
          case "static": {
            return loadStaticEnvironment(
              sandbox,
              environmentOptions?.static
            ).then((environment) => ({ environment, sandbox }));
          }
          case "bundler": {
            return loadBundlerEnvironment(
              sandbox,
              environmentOptions?.bundler
            ).then((environment) => ({ environment, sandbox }));
          }
        }
      });
    } else if (props.sandbox.environment === "static") {
      const sandbox = props.sandbox;
      sandboxRef.current = loadStaticEnvironment(
        sandbox,
        environmentOptions?.bundler
      ).then((environment) => ({
        environment,
        sandbox,
      }));
    } else if (props.sandbox.environment === "bundler") {
      const sandbox = props.sandbox;
      sandboxRef.current = loadBundlerEnvironment(
        sandbox,
        environmentOptions?.bundler
      ).then((environment) => ({
        environment,
        sandbox,
      }));
    } else {
      // TODO: Implement VM sandbox
    }
  }

  return (
    <SandpackSandboxContext.Provider value={sandboxRef.current}>
      {props.children}
    </SandpackSandboxContext.Provider>
  );
}

export function useSandbox() {
  const envPromise = useContext(SandpackSandboxContext);

  if (envPromise === null) {
    throw new Error(
      `[sandpack-react]: "useSandpack" must be wrapped by a "SandpackProvider"`
    );
  }

  const context = use(envPromise) as ContextValue;

  useSyncExternalStore(
    (update) => context.environment.onStatusChange(update),
    () => context.environment.status
  );

  return context;
}
