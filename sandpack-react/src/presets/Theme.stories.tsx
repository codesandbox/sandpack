import { storiesOf } from "@storybook/react";
import React from "react";

import { SANDPACK_THEMES } from "..";

import { Sandpack } from "./Sandpack";

const stories = storiesOf("presets/Themes", module);

Object.keys(SANDPACK_THEMES).forEach((themeName) =>
  stories.add(themeName, () => (
    <Sandpack
      files={{
        "/App.js": `const Test = () => "Test";
export default function App() {
  return (
    <div>
      <Test />
      <h1>Hello World</h1>
    </div>
  );
}
`,
      }}
      template="react"
      theme={themeName as keyof typeof SANDPACK_THEMES}
    />
  ))
);
