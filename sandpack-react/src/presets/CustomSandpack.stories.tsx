import React, { useEffect, useRef, useState } from "react";

import type { ViewportSize } from "../";
import { stackClassName } from "../";
import { tabButton } from "../";
import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
  OpenInCodeSandboxButton,
  RefreshButton,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackCodeEditor,
  SandpackTranspiledCode,
  useSandpackTheme,
  useActiveCode,
  useSandpackNavigation,
  SandpackStack,
  UnstyledOpenInCodeSandboxButton,
} from "../";
import { useSandpack } from "../hooks/useSandpack";

export default {
  title: "presets/Sandpack: custom",
};

export const UsingSandpackLayout: React.FC = () => (
  <SandpackProvider>
    <SandpackLayout>
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
      <SandpackCodeEditor />
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

export const UsingVisualElements: React.FC = () => (
  <SandpackProvider options={{ activeFile: "/App.js" }} template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor
        style={{
          width: 500,
          height: 300,
        }}
      />

      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{
          border: "1px solid red",
          marginBottom: 4,
          marginTop: 4,
          width: 500,
          height: 300,
        }}
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

const CustomRefreshButton = (): JSX.Element => {
  const { refresh } = useSandpackNavigation();

  return (
    <button onClick={(): void => refresh()} type="button">
      Refresh Sandpack
    </button>
  );
};

const CustomOpenInCSB = (): JSX.Element => {
  return (
    <UnstyledOpenInCodeSandboxButton>
      Open in CodeSandbox
    </UnstyledOpenInCodeSandboxButton>
  );
};

const CustomCodeEditor = (): JSX.Element => {
  const { code, updateCode } = useActiveCode();
  const { theme } = useSandpackTheme();

  return (
    <textarea
      onChange={(evt): void => updateCode(evt.target.value)}
      style={{
        width: 400,
        height: 200,
        padding: 8,
        fontFamily: theme.font.mono,
        fontSize: theme.font.size,
        background: theme.colors.surface1,
        border: `1px solid ${theme.colors.surface2}`,
        color: theme.colors.base,
        lineHeight: theme.font.lineHeight,
      }}
    >
      {code}
    </textarea>
  );
};

export const UsingHooks: React.FC = () => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <CustomCodeEditor />

      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{ border: "1px solid red", width: 400, height: 300 }}
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

const CustomPreview: React.FC = () => {
  const { sandpack } = useSandpack();
  const iframeRef = useRef<HTMLIFrameElement>();

  useEffect(() => {
    sandpack.registerBundler(iframeRef.current, "custom");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      files={{
        "/App.js": code,
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
        <button onClick={(): void => setFirst(!first)} type="button">
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
      <SandpackProvider>
        <SandpackLayout>
          <SandpackCodeEditor />
          {previews.map((pr) => (
            <SandpackPreview key={pr} />
          ))}
        </SandpackLayout>
      </SandpackProvider>
      <button onClick={(): void => setCount(count + 1)}>Add</button>
      <button onClick={(): void => setCount(count - 1)}>Remove</button>
    </>
  );
};

const SandpackListener: React.FC = () => {
  const { listen } = useSandpack();

  useEffect(() => {
    // eslint-disable-next-line no-console
    const unsubscribe = listen((msg) => console.log(msg));

    return unsubscribe;
  }, [listen]);

  return null;
};

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
      <button onClick={(): void => setCount(count + 1)}>Add</button>
      <button onClick={(): void => setCount(count - 1)}>Remove</button>

      <p>Amount of listeners: {listenersCount}</p>
      <button onClick={(): void => setListenersCount(listenersCount + 1)}>
        Add listener
      </button>
      <button onClick={(): void => setListenersCount(listenersCount - 1)}>
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
      <button onClick={(): void => setCount(count + 1)}>Add</button>
      <button onClick={(): void => setCount(count > 0 ? count - 1 : 0)}>
        Remove
      </button>
      <SandpackProvider>
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

export const ClosableTabs: React.FC = () => (
  <Sandpack options={{ closableTabs: true }} template="react" />
);

const ResetButtonComp: React.FC = () => {
  const { sandpack } = useSandpack();

  return (
    <button
      className={tabButton.toString()}
      onClick={sandpack.resetAllFiles}
      style={{
        background: "none",
        border: 0,
        position: "absolute",
        right: "1em",
      }}
    >
      Reset all file
    </button>
  );
};

const ResetCurrentFileButton: React.FC = () => {
  const { sandpack } = useSandpack();

  return (
    <button
      className={tabButton.toString()}
      onClick={(): void => sandpack.resetFile(sandpack.activeFile)}
      style={{
        background: "none",
        border: 0,
        position: "absolute",
        right: "1em",
      }}
    >
      Reset current files
    </button>
  );
};

export const ResetButton: React.FC = () => (
  <>
    <SandpackProvider template="react">
      <SandpackLayout>
        <div
          className={stackClassName.toString()}
          style={{ position: "relative", width: "100%" }}
        >
          <SandpackCodeEditor />
          <ResetButtonComp />
        </div>
        <SandpackStack>
          <SandpackPreview />
        </SandpackStack>
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider template="react">
      <SandpackLayout>
        <div
          className={stackClassName.toString()}
          style={{ position: "relative", width: "100%" }}
        >
          <SandpackCodeEditor />
          <ResetCurrentFileButton />
        </div>
        <SandpackStack>
          <SandpackPreview />
        </SandpackStack>
      </SandpackLayout>
    </SandpackProvider>
  </>
);

const ListenerIframeMessage = (): JSX.Element => {
  const [message, setMessage] = useState("Hello World");
  const { sandpack } = useSandpack();

  const sender = (): void => {
    Object.values(sandpack.clients).forEach((client) => {
      client.iframe.contentWindow.postMessage(message, "*");
    });
  };

  return (
    <>
      <button onClick={sender}>Send message</button>
      <input
        onChange={({ target }): void => setMessage(target.value)}
        value={message}
      />
    </>
  );
};

export const IframeMessage: React.FC = () => (
  <SandpackProvider
    files={{
      "/App.js": `import {useState, useEffect} from "react";

export default function App() {
const [message, setMessage] = useState("")

useEffect(() => {
  window.addEventListener("message", (event) => {
    setMessage(event.data);
  });
}, [])

return <h1>{message}</h1>
}
`,
    }}
    template="react"
  >
    <ListenerIframeMessage />
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
