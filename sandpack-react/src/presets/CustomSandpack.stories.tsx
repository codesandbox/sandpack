import React, { useEffect, useRef, useState } from "react";

import { useSandpack } from "../hooks/useSandpack";
import type { ViewportSize } from "../index";
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
  const iframeRef = useRef<HTMLIFrameElement>();

  useEffect(() => {
    sandpack.registerBundler(iframeRef.current, "custom");
  }, []);

  return (
    <iframe
      ref={iframeRef}
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

export const MultiplePreviews: React.FC = () => {
  const [count, setCount] = useState(2);

  const previews = Array.from(Array(count).keys());

  return (
    <>
      <SandpackProvider template="react">
        <SandpackLayout>
          <SandpackCodeEditor />
          {previews.map((pr) => (
            <SandpackPreview key={pr} />
          ))}
        </SandpackLayout>
      </SandpackProvider>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <button onClick={() => setCount(count - 1)}>Remove</button>
    </>
  );
};

function SandpackListener() {
  const { listen } = useSandpack();

  useEffect(() => {
    const unsubscribe = listen((msg) => console.log(msg));

    return unsubscribe;
  }, [listen]);

  return null;
}

export const MultiplePreviewsAndListeners: React.FC = () => {
  const [count, setCount] = useState(2);
  const [listenersCount, setListenersCount] = useState(0);

  const previews = Array.from(Array(count).keys());

  return (
    <>
      <SandpackProvider template="react">
        {new Array(listenersCount).fill(" ").map((pr) => (
          <SandpackListener key={pr} />
        ))}
        <SandpackLayout>
          <SandpackCodeEditor />
          {previews.map((pr) => (
            <SandpackPreview key={pr} />
          ))}
        </SandpackLayout>
      </SandpackProvider>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <button onClick={() => setCount(count - 1)}>Remove</button>

      <p>Amount of listeners: {listenersCount}</p>
      <button onClick={() => setListenersCount(listenersCount + 1)}>
        Add listener
      </button>
      <button onClick={() => setListenersCount(listenersCount - 1)}>
        Remove listener
      </button>
    </>
  );
};

const Box: React.FC<{
  label?: string;
  width?: number | string;
  height?: number | string;
}> = ({ children, label, width = "auto", height = "auto" }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      margin: 10,
      overflow: "auto",
      border: "1px solid gray",
      width,
      height,
    }}
  >
    <span style={{ padding: 4 }}>{label}</span>
    {children}
  </div>
);

const VIEWPORTS = ["Pixel 2", "Moto G4", "iPhone X"];

export const MultiplePreviewsRandomViewports: React.FC = () => {
  const [count, setCount] = useState(0);

  const previews = Array.from(Array(count).keys());

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add</button>
      <button onClick={() => setCount(count > 0 ? count - 1 : 0)}>
        Remove
      </button>
      <SandpackProvider template="react">
        <SandpackThemeProvider>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Box height={400} label="code editor" width={400}>
              <SandpackCodeEditor />
            </Box>
            {previews.map((pr, index) => {
              const viewport = VIEWPORTS[index % 3];
              return (
                <Box key={pr} label={viewport}>
                  <SandpackPreview viewportSize={viewport as ViewportSize} />
                </Box>
              );
            })}
          </div>
        </SandpackThemeProvider>
      </SandpackProvider>
    </>
  );
};
