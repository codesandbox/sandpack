import * as allThemes from "@codesandbox/sandpack-themes";
import { storiesOf } from "@storybook/react";
import React from "react";

import { Sandpack } from "../";

const stories = storiesOf("presets/Themes (external)", module);

Object.entries(allThemes).forEach(([themeName, value]) =>
  stories.add(themeName, () => (
    <Sandpack
      options={{ showInlineErrors: true }}
      template="react"
      theme={value}
    />
  ))
);
