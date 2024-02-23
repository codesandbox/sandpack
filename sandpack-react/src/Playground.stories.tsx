/* eslint-disable @typescript-eslint/no-explicit-any */
import * as themes from "@codesandbox/sandpack-themes";
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return <Sandpack template="vite" theme={themes.sandpackDark} />;
};

export const Playground = () => (
  <Sandpack
    files={{
      "/App.js": `export default function Bio() {
        return (
          <div class="intro">
            <h1>Welcome to my website!</h1>
          </div>
          <p class="summary">
            You can find my thoughts here.
            <br><br>
            <b>And <i>pictures</b></i> of scientists!
          </p>
        );
      }
      `,
    }}
    options={{ bundlerURL: "https://sandpack-bundler.codesandbox.io" }}
    template="react"
  />
);

/**

export default function Bio() {
  return (
   <div>
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
   
      <b>And <i>pictures</i></b> of scientists!
    </p>
    </div>
  );
}
      

 */
