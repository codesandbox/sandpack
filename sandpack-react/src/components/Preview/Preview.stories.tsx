import React from "react";

import { SandpackLayout } from "../../common/Layout";
import { SandpackProvider } from "../../contexts/sandpackContext";

import { SandpackPreview } from "./index";

export default {
  title: "components/Preview",
};

const code = `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`;

export const Component: React.FC = () => (
  <SandpackProvider
    customSetup={{
      files: {
        "/App.js": code,
      },
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithNavigator: React.FC = () => (
  <SandpackProvider
    customSetup={{
      files: {
        "/App.js": code,
      },
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
