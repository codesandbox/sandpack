import React from "react";

import { useSandpack } from "../hooks/useSandpack";
import {
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
  OpenInCodeSandboxButton,
  RefreshButton,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackCodeEditor,
  SandpackTranspiledCode,
  useCodeSandboxLink,
  useSandpackTheme,
  useActiveCode,
  useSandpackNavigation,
  SandpackStack,
} from "../index";

export default {
  title: "presets/Custom Sandpack",
};

export const UsingSandpackLayout: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackLayout theme="codesandbox-dark">
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

export const UsingVisualElements: React.FC = () => (
  <SandpackProvider activePath="/App.js" template="react">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeEditor
        customStyle={{
          width: 500,
          height: 300,
        }}
      />

      <SandpackPreview
        customStyle={{
          border: "1px solid red",
          marginBottom: 4,
          marginTop: 4,
          width: 500,
          height: 300,
        }}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />

      <div
        style={{
          display: "flex",
          width: 500,
          justifyContent: "space-between",
        }}
      >
        <OpenInCodeSandboxButton />
        <RefreshButton />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

const CustomOpenInCSB = () => {
  const url = useCodeSandboxLink();
  return <a href={url}>Open in CodeSandbox</a>;
};

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button onClick={() => refresh()} type="button">
      Refresh Sandpack
    </button>
  );
};

const CustomCodeEditor = () => {
  const { code, updateCode } = useActiveCode();
  const { theme } = useSandpackTheme();

  return (
    <textarea
      onChange={(evt) => updateCode(evt.target.value)}
      style={{
        width: 400,
        height: 200,
        padding: 8,
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.fontSize,
        background: theme.palette.defaultBackground,
        border: `1px solid ${theme.palette.inactiveText}`,
        color: theme.palette.activeText,
        lineHeight: 1.4,
      }}
    >
      {code}
    </textarea>
  );
};

export const UsingHooks: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <CustomCodeEditor />

      <SandpackPreview
        customStyle={{ border: "1px solid red", width: 400, height: 300 }}
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
      />

      <div
        style={{
          display: "flex",
          width: 400,
          margin: "8px 0",
          justifyContent: "space-between",
        }}
      >
        <CustomRefreshButton />
        <CustomOpenInCSB />
      </div>

      <div style={{ width: 400 }}>
        <SandpackTranspiledCode />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

const code1 = `import React from 'react'

function Kitten() {
  return (
    <img 
      src="https://placekitten.com/200/200" 
      alt="Kitten" 
    />
  )
}

export default function KittenGallery() {
  return (
    <section>
      <h1>A Gallery of Adorable Kittens</h1>
      <Kitten />
      <Kitten />
      <Kitten />
    </section>
  );
}`;
const code2 = `import React from 'react'

export default function KittenGallery() {
  return (
    <img 
      src="https://placekitten.com/200/200" 
      alt="Kitten" 
    />
  )
}`;

const CustomPreview = () => {
  const { sandpack } = useSandpack();

  return (
    <iframe
      ref={sandpack.iframeRef}
      style={{
        width: 400,
        height: 400,
      }}
      title="Sandpack Preview"
    />
  );
};

export const JustIframe = (): React.ReactElement => {
  const [first, setFirst] = React.useState(true);
  const code = first ? code1 : code2;

  return (
    <SandpackProvider
      customSetup={{
        files: {
          "/App.js": code,
        },
      }}
      template="react"
    >
      <CustomPreview />
      <CustomPreview />
      <div
        style={{
          display: "flex",
          width: 400,
          margin: "8px 0",
          justifyContent: "space-between",
        }}
      >
        <CustomRefreshButton />
        <button onClick={() => setFirst(!first)} type="button">
          Switch
        </button>
        <CustomOpenInCSB />
      </div>
    </SandpackProvider>
  );
};
