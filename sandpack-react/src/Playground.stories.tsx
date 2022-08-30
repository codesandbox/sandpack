/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import { css } from "@stitches/core";
import { useState } from "react";

import type { CodeEditorProps } from "./components/CodeEditor";
import { SANDBOX_TEMPLATES } from "./templates";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackConsole,
  SandpackTests,
} from "./";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  const [config, setConfig] = useState({
    Components: {
      Preview: true,
      Editor: true,
      FileExplorer: true,
      Console: true,
      Tests: true,
    },
    Options: {
      showTabs: true,
      showLineNumbers: true,
      showInlineErrors: true,
      closableTabs: true,
      wrapContent: false,
      readOnly: false,
      showReadOnly: true,
      showNavigator: true,
      showRefreshButton: true,
      consoleShowHeader: true,
    },
    Template: "exhaustedFilesTests" as const,
    Theme: "light",
  });

  const update = (key: any, value: any): void => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const toggle = (key: any, value: any): void => {
    setConfig((prev) => {
      return {
        ...prev,
        [key]: { ...prev[key], [value]: !prev[key][value] },
      };
    });
  };

  const codeEditorOptions: CodeEditorProps = {
    showTabs: config.Options.showTabs,
    showLineNumbers: config.Options.showLineNumbers,
    showInlineErrors: config.Options.showInlineErrors,
    wrapContent: config.Options.wrapContent,
    closableTabs: config.Options.closableTabs,
    readOnly: config.Options.readOnly,
    showReadOnly: config.Options.showReadOnly,
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "2em", minWidth: 200 }}>
        {Object.entries(config).map(([key, value]) => {
          if (typeof value === "string") {
            if (key === "Template") {
              return (
                <div>
                  <h3>Template</h3>
                  <select
                    onChange={({ target }): void =>
                      update("Template", target.value)
                    }
                    value={config.Template}
                  >
                    <option value="exhaustedFilesTests">
                      exhaustedFilesTests
                    </option>
                    {Object.keys(SANDBOX_TEMPLATES).map((tem) => (
                      <option value={tem}>{tem}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (key === "Theme") {
              return (
                <div>
                  <h3>Themes</h3>
                  <select
                    onChange={({ target }): void =>
                      update("Theme", target.value)
                    }
                    value={config.Theme}
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    {Object.keys(themes).map((tem) => (
                      <option value={tem}>{tem}</option>
                    ))}
                  </select>
                </div>
              );
            }

            return value;
          }

          return (
            <>
              <h3>{key}</h3>
              {Object.entries(value).map(([prop, propValue]) => {
                return (
                  <p>
                    <label>
                      <input
                        defaultChecked={!!propValue}
                        onClick={(): void => toggle(key, prop)}
                        type="checkbox"
                      />
                      {prop}
                    </label>
                  </p>
                );
              })}
            </>
          );
        })}
      </div>

      <SandpackProvider
        customSetup={{
          dependencies:
            config.Template === "exhaustedFilesTests"
              ? exhaustedFilesTests.dependencies
              : {},
        }}
        files={
          config.Template === "exhaustedFilesTests"
            ? exhaustedFilesTests.files
            : {}
        }
        template={
          config.Template === "exhaustedFilesTests" ? null : config.Template
        }
        theme={themes[config.Theme] || config.Theme}
      >
        <SandpackLayout>
          <div className={gridClassName.toString()}>
            {config.Components.FileExplorer && <SandpackFileExplorer />}
            {config.Components.Editor && (
              <SandpackCodeEditor {...codeEditorOptions} />
            )}
            {config.Components.Preview && (
              <SandpackPreview
                showNavigator={config.Options?.showNavigator}
                showRefreshButton={config.Options?.showRefreshButton}
              />
            )}

            {config.Components.Console && (
              <SandpackConsole showHeader={config.Options.consoleShowHeader} />
            )}
            {config.Components.Tests && <SandpackTests />}
          </div>
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

const gridClassName = css({
  display: "grid",
  gridTemplateColumns: "200px 400px 400px",
  gridTemplateRows: "repeat(2, 250px)",
  gap: 1,

  ".sp-file-explorer": {
    gridArea: "1 / 1 / 3 / 2",
  },

  ".sp-editor": {
    gridArea: "1 / 2 / 2 / 3",
  },

  ".sp-preview": {
    gridArea: "1 / 3 / 2 / 4",
  },

  ".sp-console": {
    gridArea: "2 / 2 / 3 / 3",
  },
  ".sp-tests": {
    gridArea: "2 / 3 / 3 / 4",
  },
});

const exhaustedFilesTests = {
  ...SANDBOX_TEMPLATES["react-ts"],
  files: {
    "/src/utils/add.ts": SANDBOX_TEMPLATES["test-ts"].files["/add.ts"],
    "/src/utils/add.test.ts":
      SANDBOX_TEMPLATES["test-ts"].files["/add.test.ts"],
    "/src/index.tsx": SANDBOX_TEMPLATES["react-ts"].files["/index.tsx"],
    "/src/App.tsx": `console.log("Hello world");\n\n${SANDBOX_TEMPLATES["react-ts"].files["/App.tsx"].code}`,
    "/src/styles.css": SANDBOX_TEMPLATES["react-ts"].files["/styles.css"],
    "/package.json": JSON.stringify({ main: "/src/index.tsx" }),
  },
};
