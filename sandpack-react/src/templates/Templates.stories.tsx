import { storiesOf } from "@storybook/react";
import React from "react";

import { Sandpack } from "../";

import { SANDBOX_TEMPLATES } from ".";

const stories = storiesOf("presets/Template", module);

stories.add("example", () => (
  <Sandpack
    template="react-ts"
    files={{
      "/App.tsx": "code",
    }}
    // customSetup={{ entry: "/App.tsx", main: "/App.tsx" }}
    options={{ showTabs: true }}
  />
));

// Object.keys(SANDBOX_TEMPLATES).forEach((template) =>
//   stories.add(template, () => <Sandpack template={template} />)
// );
