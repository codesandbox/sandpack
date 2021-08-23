import { storiesOf } from "@storybook/react";
import React from "react";

import { SANDPACK_THEMES } from "..";

import { Sandpack } from "./Sandpack";

const stories = storiesOf("presets/Themes", module);

Object.keys(SANDPACK_THEMES).forEach((themeName) =>
  stories.add(themeName, () => (
    <Sandpack theme={themeName as keyof typeof SANDPACK_THEMES} />
  ))
);
