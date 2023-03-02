import * as allThemes from "@codesandbox/sandpack-themes";
import { storiesOf } from "@storybook/react";
import React from "react";

import {
  Sandpack,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
} from "../";

const stories = storiesOf("presets/Themes (external)", module);

Object.entries(allThemes).forEach(([themeName, value]) =>
  stories.add(themeName, () => (
    <>
      <Sandpack
        options={{
          showLineNumbers: true,
          showInlineErrors: true,
          showNavigator: true,
          showTabs: true,
        }}
        template="nextjs"
        theme={value}
      />

      <SandpackProvider template="nextjs" theme={value}>
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor showLineNumbers showTabs />
          <SandpackPreview showNavigator />
        </SandpackLayout>
      </SandpackProvider>
    </>
  ))
);
