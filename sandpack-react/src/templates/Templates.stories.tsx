import { storiesOf } from "@storybook/react";
import React from "react";

import type { SandpackPredefinedTemplate } from "../";
import { Sandpack } from "../";

import { SANDBOX_TEMPLATES } from ".";

const stories = storiesOf("presets/Template", module);

Object.keys(SANDBOX_TEMPLATES).forEach((template) =>
  stories.add(template, () => (
    <Sandpack
      options={{ bundlerURL: "http://localhost:3000/" }}
      template={template as SandpackPredefinedTemplate}
    />
  ))
);
