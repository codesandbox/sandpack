import React from "react";
import { Sandpack } from "./presets";

export default {
  title: "Intro/PrivatePackage",
};

export const Basic: React.FC = () => {
  return (
    <Sandpack
      template="react"
      files={{
        "/package.json": JSON.stringify({
          main: "index.js",
          dependencies: {
            react: "15.4.2",
            "react-dom": "15.4.2",
          },
        }),
      }}
      options={{ bundlerURL: "http://localhost:3000/" }}
      customSetup={{
        npmRegistries: [
          {
            enabledScopes: ["@codesandbox"],
            limitToScopes: true,
            proxyEnabled: true,
            registryUrl:
              "https://codesandbox.io/api/v1/sandboxes/h9zysf/npm_registry",
          },
        ],
      }}
    />
  );
};
