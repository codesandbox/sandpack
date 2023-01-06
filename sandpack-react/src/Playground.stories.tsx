/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import { useState } from "react";

import type { CodeEditorProps } from "./components/CodeEditor";
import { Sandpack } from "./presets";
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

export const Preset = (): JSX.Element => {
  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", padding: "4em 0" }}>
        <Sandpack
          files={{
            "App.js": `export default function App() {
  return <h1 onClick={() => {
    console.log("Hello world");
  }}>Hello World</h1>
}

          `,
          }}
          options={{
            showLineNumbers: true,
            showConsole: true,
            showConsoleButton: true,
            resizablePanels: false,
          }}
          template="react"
        />

        <br />

        <Sandpack
          options={{
            showLineNumbers: true,
            showConsole: false,
            showConsoleButton: false,
          }}
          template="vue"
        />

        <br />

        <Sandpack
          options={{
            showLineNumbers: true,
            showConsole: false,
            showConsoleButton: true,
          }}
        />
      </div>
    </>
  );
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
      showConsoleButton: true,
      showConsole: true,
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

      <div>
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
            <div className="playground-grid">
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
                <SandpackConsole
                  showHeader={config.Options.consoleShowHeader}
                />
              )}
              {config.Components.Tests && <SandpackTests />}
            </div>
          </SandpackLayout>
        </SandpackProvider>

        <br />

        <Sandpack
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
          options={{
            ...config.Options,
          }}
          template={
            config.Template === "exhaustedFilesTests" ? null : config.Template
          }
          theme={themes[config.Theme] || config.Theme}
        />
      </div>
    </div>
  );
};

const defaultTemplate = SANDBOX_TEMPLATES["react-ts"];

const exhaustedFilesTests = {
  ...defaultTemplate,

  files: {
    "/src/index.tsx": defaultTemplate.files["/index.tsx"],
    "/src/App.tsx": `console.log("Hello world");\n\n${defaultTemplate.files["/App.tsx"].code}`,
    "/src/App.test.tsx": `import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});`,
    "/src/styles.css": defaultTemplate.files["/styles.css"],
    "/package.json": JSON.stringify({
      dependencies: {
        react: "^18.0.0",
        "react-dom": "^18.0.0",
        "react-scripts": "^4.0.0",
        "@testing-library/react": "^13.3.0",
        "@testing-library/jest-dom": "^5.16.5",
      },
      devDependencies: {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        typescript: "^4.0.0",
      },
      main: "/add.ts",
    }),
  },
};
