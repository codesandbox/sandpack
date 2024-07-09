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
          bundlerURL: "https://ymxnqs-3000.csb.app",
        }}
        template="react"
        customSetup={{
          dependencies: {
            "react-content-loader": "latest",
            "radix-ui": "latest",
            "styled-components": "latest",
            "react-dom": "latest",
            react: "latest",
            "react-table": "latest",
          },
        }}
      />
    </div>
  );
};
