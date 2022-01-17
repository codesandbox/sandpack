import { storiesOf } from "@storybook/react";
import React from "react";

import * as icons from ".";

const stories = storiesOf("Components/Icons", module);

Object.keys(icons).forEach((iconName) =>
  stories.add(iconName, () => {
    const Component = icons[iconName];

    return <Component />;
  })
);
