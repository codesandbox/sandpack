/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import LZString from "lz-string";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import type { SandboxEnvironment } from "../../types";

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

/**
 * @category Components
 */
export const UnstyledOpenInCodeSandboxButton: React.FC<
  React.HtmlHTMLAttributes<unknown>
> = ({ children, ...props }) => {
  const { sandpack } = useSandpack();
  const formRef = React.useRef<HTMLFormElement>(null);

  const [paramsValues, setParamsValues] = React.useState<URLSearchParams>();

  React.useEffect(
    function debounce() {
      const timer = setTimeout(() => {
        const params = getFileParameters(sandpack.files, sandpack.environment);

        const searchParams = new URLSearchParams({
          parameters: params,
          query: new URLSearchParams({
            file: sandpack.activeFile,
            "from-sandpack": "true",
          }).toString(),
        });

        setParamsValues(searchParams);
      }, 600);

      return (): void => {
        clearTimeout(timer);
      };
    },
    [sandpack.activeFile, sandpack.environment, sandpack.files]
  );

  /**
   * Register the usage of the codesandbox link
   */
  React.useEffect(function registerUsage() {
    sandpack.openInCSBRegisteredRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * This is a safe limit to avoid too long requests (401),
   * as all parameters are attached in the URL
   */
  if ((paramsValues?.get?.("parameters")?.length ?? 0) > 1500) {
    return (
      <button
        onClick={(): void => formRef.current?.submit()}
        title="Open in CodeSandbox"
        {...props}
      >
        <form
          ref={formRef}
          action={CSB_URL}
          method="POST"
          style={{ visibility: "hidden" }}
          target="_blank"
        >
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
      href={`${CSB_URL}?${paramsValues?.toString()}`}
      rel="noreferrer noopener"
      target="_blank"
      title="Open in CodeSandbox"
      {...props}
    >
      {children}
    </a>
  );
};
