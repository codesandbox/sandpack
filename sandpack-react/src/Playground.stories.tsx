/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackProvider,
} from "./";

export default {
  title: "Intro/Playground",
};

export const Basic: React.FC = () => {
  return (
    <div style={{ height: "400vh" }}>
      <SandpackProvider>
        <SandpackLayout>
          <SandpackFileExplorer />
          <SandpackCodeEditor closableTabs showTabs />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};
