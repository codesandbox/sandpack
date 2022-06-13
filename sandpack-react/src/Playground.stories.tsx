import { useState } from "react";
import * as themes from "@codesandbox/sandpack-themes";

import { SANDBOX_TEMPLATES } from "./templates";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackLayout,
} from "./";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  const [config, setConfig] = useState({
    Components: { Preview: true, Editor: true, FileExplorer: true },
    Options: {},
    Template: "react",
    Theme: "auto",
  });

  const update = (key: any, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  console.log(config);

  return (
    <>
      <div>
        {Object.entries(config).map(([key, value]) => {
          if (typeof value === "string") {
            if (key === "Template") {
              return (
                <div>
                  <p>Themes</p>
                  <select>
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
                  <p>Themes</p>
                  <select
                    onChange={({ target }) => update("Theme", target.value)}
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
              <h2>{key}</h2>
              {Object.entries(value).map((prop, propValue) => {
                return (
                  <label>
                    <input checked={!!propValue} type="checkbox" />
                    {prop}
                  </label>
                );
              })}
            </>
          );
        })}
      </div>

      <SandpackProvider
        theme={themes[config.Theme] || config.Theme}
        template={config.Template}
      >
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};
