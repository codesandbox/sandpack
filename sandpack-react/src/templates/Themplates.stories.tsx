import { storiesOf } from "@storybook/react";
import React from "react";

import { SANDBOX_TEMPLATES } from ".";
import { Sandpack } from "../";

const stories = storiesOf("presets/Template", module);

Object.keys(SANDBOX_TEMPLATES).forEach((template) =>
    stories.add(template, () => <Sandpack template={template} />)
);
