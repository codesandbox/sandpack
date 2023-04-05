import type { Story } from "@storybook/react";
import * as React from "react";

import {
  SandpackCodeEditor,
  SandpackThemeProvider,
  SandpackProvider,
  SandpackLayout,
} from "../../";
import { useSandpack } from "../../hooks";

import type { PreviewProps, SandpackPreviewRef } from "./index";
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
    files={{
      "/App.js": code,
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
    files={{
      "/App.js": code,
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

export const WithNavigator: React.FC = () => (
  <SandpackProvider
    files={{
      "/App.js": code,
    }}
    template="react"
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);

export const MultipleRoutePreviews: React.FC = () => {
  return (
    <SandpackProvider
      files={{
        "/pages/index.js": `export default () => "Home"`,
        "/pages/about.js": `export default () => "About"`,
        "/pages/careers.js": `export default () => "Careers"`,
      }}
      options={{ startRoute: "/" }}
      template="nextjs"
    >
      <SandpackLayout>
        <SandpackPreview showNavigator />
        <SandpackPreview startRoute="/about" showNavigator />
        <SandpackPreview startRoute="/careers" showNavigator />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export const AutoResize: React.FC = () => (
  <SandpackProvider
    files={{
      "/App.js": code,
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
            onClick={(): void => window.alert("Bug reported!")}
            style={{ padding: "var(--sp-space-1) var(--sp-space-3)" }}
          >
            Report bug
          </button>
        }
      />
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);

export const AdditionalContent: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview>
        <div style={{ background: "lightgreen" }}>content after iframe</div>
      </SandpackPreview>
      <SandpackCodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);

const SandpackClient: React.FC = () => {
  const { sandpack } = useSandpack();
  const previewRef = React.useRef<SandpackPreviewRef>();

  React.useEffect(() => {
    const client = previewRef.current?.getClient();
    const clientId = previewRef.current?.clientId;

    if (client && clientId) {
      /* eslint-disable no-console */
      console.log(client);
      console.log(sandpack.clients[clientId]);
    }
  }, [sandpack]);

  return <SandpackPreview ref={previewRef} />;
};

export const GetClient: React.FC = () => {
  return (
    <SandpackProvider template="react">
      <SandpackLayout>
        <SandpackClient />
        <SandpackCodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  );
};
