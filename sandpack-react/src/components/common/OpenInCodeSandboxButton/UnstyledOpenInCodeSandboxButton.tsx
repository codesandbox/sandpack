/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import LZString from "lz-string";
import * as React from "react";

import { useSandpack } from "../../../hooks/useSandpack";
import type { SandboxEnvironment, SandpackState } from "../../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getParameters = (parameters: Record<string, any>): string =>
  LZString.compressToBase64(JSON.stringify(parameters))
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, ""); /* Remove ending '='*/

const CSB_URL = "https://codesandbox.io/api/v1/sandboxes/define";

const getFileParameters = (
  files: SandpackBundlerFiles,
  environment?: SandboxEnvironment
): string => {
  type NormalizedFiles = Record<
    string,
    {
      content: string;
      isBinary: boolean;
    }
  >;

  const normalizedFiles = Object.keys(files).reduce((prev, next) => {
    const fileName = next.replace("/", "");
    const value = {
      content: files[next].code,
      isBinary: false,
    };

    return { ...prev, [fileName]: value };
  }, {} as NormalizedFiles);

  return getParameters({
    files: normalizedFiles,
    ...(environment ? { template: environment } : null),
  });
};

export const UnstyledOpenInCodeSandboxButton: React.FC<
  React.HtmlHTMLAttributes<unknown>
> = (props) => {
  const { sandpack } = useSandpack();

  if (sandpack.exportOptions) {
    return <ExportToWorkspaceButton state={sandpack} {...props} />;
  }

  return <RegularExportButton state={sandpack} {...props} />;
};

export const ExportToWorkspaceButton: React.FC<
  React.HtmlHTMLAttributes<unknown> & { state: SandpackState }
> = ({ children, state, ...props }) => {
  const submit = async () => {
    if (!state.exportOptions?.apiToken) {
      throw new Error("Missing `apiToken` property");
    }

    const normalizedFiles = Object.keys(state.files).reduce((prev, next) => {
      const fileName = next.replace("/", "");
      return { ...prev, [fileName]: state.files[next] };
    }, {});

    const response = await fetch("https://api.codesandbox.io/sandbox", {
      method: "POST",
      body: JSON.stringify({
        template: state.environment,
        files: normalizedFiles,
        privacy: state.exportOptions.privacy === "public" ? 0 : 2,
      }),
      headers: {
        Authorization: `Bearer ${state.exportOptions.apiToken}`,
        "Content-Type": "application/json",
        "X-CSB-API-Version": "2023-07-01",
      },
    });

    const data: { data: { alias: string } } = await response.json();

    window.open(
      `https://codesandbox.io/p/sandbox/${data.data.alias}?file=/${state.activeFile}&utm-source=storybook-addon`,
      "_blank"
    );
  };

  return (
    <button
      onClick={submit}
      title="Export to workspace in CodeSandbox"
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const RegularExportButton: React.FC<
  React.HtmlHTMLAttributes<unknown> & { state: SandpackState }
> = ({ children, state, ...props }) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [paramsValues, setParamsValues] = React.useState<URLSearchParams>();

  React.useEffect(
    function debounce() {
      const timer = setTimeout(() => {
        const params = getFileParameters(state.files, state.environment);

        const searchParams = new URLSearchParams({
          parameters: params,
          query: new URLSearchParams({
            file: state.activeFile,
            utm_medium: "sandpack",
          }).toString(),
        });

        setParamsValues(searchParams);
      }, 600);

      return (): void => {
        clearTimeout(timer);
      };
    },
    [state.activeFile, state.environment, state.files]
  );

  /**
   * This is a safe limit to avoid too long requests (401),
   * as all parameters are attached in the URL
   */
  if ((paramsValues?.get?.("parameters")?.length ?? 0) > 1500) {
    return (
      <button
        onClick={(): void => formRef.current?.submit()}
        title="Open in CodeSandbox"
        type="button"
        {...props}
      >
        <form
          ref={formRef}
          action={CSB_URL}
          method="POST"
          style={{ visibility: "hidden" }}
          target="_blank"
        >
          <input
            name="environment"
            type="hidden"
            value={state.environment === "node" ? "server" : state.environment}
          />
          {Array.from(
            paramsValues as unknown as Array<[string, string]>,
            ([key, value]) => (
              <input key={key} name={key} type="hidden" value={value} />
            )
          )}
        </form>
        {children}
      </button>
    );
  }

  return (
    <a
      href={`${CSB_URL}?${paramsValues?.toString()}&environment=${
        state.environment === "node" ? "server" : state.environment
      }`}
      rel="noreferrer noopener"
      target="_blank"
      title="Open in CodeSandbox"
      {...props}
    >
      {children}
    </a>
  );
};
