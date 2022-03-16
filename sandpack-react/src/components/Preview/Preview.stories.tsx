import type { Story } from "@storybook/react";
import * as React from "react";

import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
  SandpackLayout,
} from "../../";

import type { PreviewProps } from "./index";
import { SandpackPreview } from "./index";

export default {
  title: "components/Preview",
  component: SandpackPreview,
};

const code = `export default function Kitten() {
  return (
    <>
      <img src="https://placekitten.com/200/250" alt="Kitten" />
      <img src="https://placekitten.com/200/250" alt="Kitten" />
      <img src="https://placekitten.com/200/250" alt="Kitten" />
    </>
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

export const Viewport: Story<PreviewProps> = (args) => (
  <SandpackProvider
    customSetup={{
      files: {
        "/App.js": code,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <div style={{ border: "1px solid grey", display: "inline-block" }}>
        <SandpackPreview {...args} />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

Viewport.argTypes = {
  viewportSize: {
    control: {
      type: "select",
      options: [
        "iPhone X",
        "iPad",
        "Pixel 2",
        "Moto G4",
        "Surface Duo",
        "auto",
      ],
    },
  },
};

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

export const AutoResize: React.FC = () => (
  <SandpackProvider
    customSetup={{
      files: {
        "/App.js": code,
      },
    }}
    template="react"
  >
    <SandpackThemeProvider>
      <SandpackPreview />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const AdditionalButtons: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview
        actionsChildren={
          <button
            className="sp-button"
            style={{ padding: "var(--sp-space-1) var(--sp-space-3)" }}
            onClick={() => window.alert("Bug reported!")}
          >
            Report bug
          </button>
        }
      />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);
