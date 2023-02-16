/* eslint-disable react-hooks/exhaustive-deps,@typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import styles from "./CodeBlock.module.css";

const ListenerResize: React.FC<{ onResize: (height: number) => void }> = ({
  onResize,
}) => {
  const { listen } = useSandpack();

  useEffect(() => {
    const unsubs = listen((message) => {
      if (message.type === "resize") {
        onResize(message.height);
      }
    });

    return unsubs;
  }, []);

  return null;
};

export const CodeBlock: React.FC<{ children: string; stack: boolean }> = ({
  children,
  stack,
  ...props
}) => {
  const { theme } = useTheme();
  const [height, setHeight] = useState(150);

  const getTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? sandpackDark
        : "light";
    }

    if (theme === "dark") return sandpackDark;

    return "light";
  };

  const sandpackProps = {
    customSetup: {
      dependencies: {
        "@codesandbox/sandpack-react": "latest",
        "@codesandbox/sandpack-themes": "latest",
      },
    },
    files: {
      "/App.js": children,
    },
    template: "react" as const,
    theme: getTheme(),
    options: { showLineNumbers: true, initMode: "immediate" },
    key: children,
    ...props,
  } as any;

  if (stack) {
    return (
      <SandpackProvider
        {...sandpackProps}
        files={{
          ...sandpackProps.files,
          "/styles.css": {
            hidden: true,
            code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  margin: 0;
}

h1 {
  font-size: 1.5rem;
}`,
          },
        }}
      >
        <div
          className="nx-mt-6 nx-flex nx-px-2 ltr:nx-pr-4 rtl:nx-pl-4 nx-bg-black/[.03] dark:nx-bg-gray-50/10 dark:nx-text-neutral-500"
          style={{
            marginBottom: -1,
            position: "relative",
            zIndex: 9,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            border: `1px solid var(--sp-colors-surface2)`,
            borderBottom: 0,
          }}
        >
          <div className="nx-min-w-0">
            <p className="nx-text-gray-500 nx-mt-6 nx-leading-7 first:nx-mt-0 nx-flex">
              <svg
                className="nx-mr-2 nx-text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m8 17.95-6-6L8.05 5.9l1.075 1.075L4.15 11.95l4.925 4.925L8 17.95Zm7.95.05-1.075-1.075 4.975-4.975-4.925-4.925L16 5.95l6 6L15.95 18Z"
                  fill="currentColor"
                />
              </svg>
              Editable example
            </p>
          </div>
        </div>

        {/* @ts-ignore */}
        <SandpackLayout className="nx-sandpack-fluid-layout">
          <SandpackCodeEditor showLineNumbers />
        </SandpackLayout>

        <div className={styles.previewWrapper} style={{ height }}>
          <ListenerResize onResize={(height) => setHeight(height)} />
          <div
            className="nx-mt-4 nx-flex nx-px-2 ltr:nx-pr-4 rtl:nx-pl-4 nx-bg-black/[.03] dark:nx-bg-gray-50/10 dark:nx-text-neutral-500"
            style={{
              marginBottom: -1,
              position: "relative",
              zIndex: 9,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              border: `1px solid var(--sp-colors-surface2)`,
              borderBottom: 0,
            }}
          >
            <div className="nx-min-w-0">
              <p className="nx-text-gray-500 nx-mt-6 nx-leading-7 first:nx-mt-0  nx-flex">
                <svg
                  className="nx-mr-2 nx-text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 37.85v-28l22 14Zm3-14Zm0 8.55 13.45-8.55L19 15.3Z" />
                </svg>
                Preview
              </p>
            </div>
          </div>

          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton={false}
          />
        </div>
        <br />
        <br />
      </SandpackProvider>
    );
  }

  return <Sandpack {...sandpackProps} />;
};
