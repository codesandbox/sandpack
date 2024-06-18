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
          experimental_enableServiceWorker: true,
          // bundlerURL: isNodeStatic
          //   ? undefined
          //   : "https://1-17-1-{{suffix}}-sandpack.codesandbox.io/",
        }}
        // teamId="642af90c-4717-4730-bad3-e4c1e37ca5e2"
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
