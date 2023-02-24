/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./presets";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  const [text, setText] = React.useState("world");
  return (
    <>
      <input
        defaultValue={text}
        onChange={({ target }) => setText(target.value)}
      />
      <Sandpack
        files={{
          "App.js": `export default function App() {
  return <h1>Hello ${text}</h1>
}
`,
        }}
        template="react"
        theme={themes.sandpackDark}
      />
    </>
  );
};
