import type { SandpackBundlerFiles } from "@codesandbox/sandpack-client";
import { getParameters } from "codesandbox-import-utils/lib/api/define";
import * as React from "react";

import { useSandpack } from "../../hooks/useSandpack";
import type { SandboxEnvironment } from "../../types";

const CSB_URL = "https://codesandbox.io/api/v1/sandboxes/define";

const getFileParameters = (
  files: SandpackBundlerFiles,
  environment?: SandboxEnvironment
) => {
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
> = ({ children, ...props }) => {
  const [paramsValues, setParamsValues] = React.useState("");
  const { sandpack } = useSandpack();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(
    function debounce() {
      const timer = setTimeout(() => {
        const params = getFileParameters(sandpack.files, sandpack.environment);

        setParamsValues(params);
      }, 600);

      return () => {
        clearTimeout(timer);
      };
    },
    [sandpack.environment, sandpack.files]
  );

  // Register the usage of the codesandbox link
  React.useEffect(function registerUsage() {
    sandpack.openInCSBRegisteredRef.current = true;
  }, []);

  /**
   * This is a safe limit to avoid too long requests (401),
   * as all parameters are attached in the URL
   */
  if (paramsValues.length > 1500) {
    return (
      <button
        onClick={() => formRef.current?.submit()}
        title="Open in CodeSandbox"
        {...props}
      >
        <form ref={formRef} action={CSB_URL} method="POST" target="_blank">
          <input name="parameters" type="hidden" value={paramsValues} />
        </form>
        {children}
      </button>
    );
  }

  return (
    <a
      href={`${CSB_URL}?parameters=${paramsValues}&query=file=${sandpack.activePath}%26from-sandpack=true`}
      rel="noreferrer noopener"
      target="_blank"
      title="Open in CodeSandbox"
      {...props}
    >
      {children}
    </a>
  );
};
