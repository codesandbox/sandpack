/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import { useState } from "react";

import type { CodeEditorProps } from "./components/CodeEditor";
import { SANDBOX_TEMPLATES } from "./templates";

import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
  SandpackFileExplorer,
} from "./";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  const [config, setConfig] = useState({
    Components: { Preview: true, Editor: true, FileExplorer: true },
    Options: {
      showTabs: true,
      showLineNumbers: true,
      showInlineErrors: true,
      closableTabs: true,
      wrapContent: true,
      readOnly: false,
      showReadOnly: true,
      showNavigator: true,
      showRefreshButton: true,
    },
    Template: "react",
    Theme: "auto",
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
        template={config.Template}
        theme={themes[config.Theme] || config.Theme}
      >
        <SandpackLayout>
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
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};
