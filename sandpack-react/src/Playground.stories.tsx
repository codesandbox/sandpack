/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

localStorage.setItem("SANDPACK_INTERNAL:URL-CONSISTENT-ID", "123123123");

export const Basic: React.FC = () => {
  return (
    <div style={{ height: "400vh" }}>
      <Sandpack
        options={{
          showTabs: true,
          closableTabs: true,
          experimental_enableServiceWorker: true,
          experimental_enableStableServiceWorkerId: true,
        }}
        // customSetup={{
        //   dependencies: {
        //     "react-content-loader": "latest",
        //     "radix-ui": "latest",
        //     "styled-components": "latest",
        //     "react-dom": "latest",
        //     react: "latest",
        //     "react-table": "latest",
        //   },
        // }}
        // options={{
        //   bundlerURL: "https://ymxnqs-3000.csb.app",
        // }}
        template="react"
      />
    </div>
  );
};
