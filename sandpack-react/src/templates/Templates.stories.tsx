import { storiesOf } from "@storybook/react";
import React from "react";

import type { SandpackPredefinedTemplate } from "../";
import { SandpackLayout, SandpackProvider } from "../";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackPreview,
} from "../components";

import { SANDBOX_TEMPLATES } from ".";

const stories = storiesOf("presets/Template", module);

Object.keys(SANDBOX_TEMPLATES).forEach((template) =>
  stories.add(template, () => {
    const isNodeStatic =
      SANDBOX_TEMPLATES[template].environment === "node" ||
      SANDBOX_TEMPLATES[template].environment === "static";

    return (
      <SandpackProvider
        options={{
          bundlerTimeOut: 90000,
          bundlerURL: isNodeStatic
            ? undefined
            : "https://1-17-1-sandpack.codesandbox.io/",
        }}
        template={template as SandpackPredefinedTemplate}
      >
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showLineNumbers />
          <SandpackPreview showNavigator />
        </SandpackLayout>
        <br />
        <SandpackLayout>
          <SandpackConsole />
        </SandpackLayout>
      </SandpackProvider>
    );
  })
);
