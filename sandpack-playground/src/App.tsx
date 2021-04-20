import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";

export const App: React.FC = () => {
  return (
    <Sandpack
      files={{
        "/App.js": "",
      }}
      options={{
        autorun: false,
        showTabs: true,
        showLineNumbers: true,
        showNavigator: true,
      }}
      template="react"
    />
  );
};
