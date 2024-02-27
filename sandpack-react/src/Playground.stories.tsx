/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <div style={{ height: "400vh" }}>
      <Sandpack
        options={{
          initMode: "user-visible",
          bundlerURL: "https://786946de.sandpack-bundler-4bw.pages.dev",
        }}
        template="react"
      />
    </div>
  );
};
