import React, { useEffect, useId, useRef, useState } from "react";

import { stackClassName } from "../";
import { tabButton } from "../";
import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
  OpenInCodeSandboxButton,
  RoundedButton,
  RefreshIcon,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackCodeEditor,
  SandpackTranspiledCode,
  useSandpackTheme,
  useActiveCode,
  useSandpackNavigation,
  SandpackStack,
  UnstyledOpenInCodeSandboxButton,
  SandpackFileExplorer,
  SandpackConsumer,
  CodeEditor,
  type SandpackContext,
} from "../";
import { useSandpack } from "../hooks/useSandpack";

export default {
  title: "presets/Sandpack: custom",
};

export const ExperimentalServiceWorker: React.FC = () => {
  return (
    <Sandpack
      files={{
        "/public/logo.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">
  <title>React Logo</title>
  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
  <g stroke="#61dafb" stroke-width="1" fill="none">
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </g>
</svg>
  `,
        "/App.js": `export default function App() {
  return (
    <>
      <h1>Hello React</h1>
      <img width="100" src="/public/logo.svg" />
    </>
  );
}
        `,
      }}
      options={{
        experimental_enableServiceWorker: true,
        experimental_enableStableServiceWorkerId: true,
      }}
      template="react"
    />
  );
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

export const UsingMultipleEditor: React.FC = (props) => {
  const [isAutoReload, setAutoReload] = React.useState(true);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
      }}
    >
      <SandpackProvider
        {...props}
        options={{ initMode: "immediate", autoReload: isAutoReload }}
        template="static"
      >
        <SandpackConsumer>
          {(context: SandpackContext | null) => {
            if (!context) return <></>;

            const { files, updateFile, autoReload } = context;
            const fileListValues = Object.values(files);
            const fileListKeys = Object.keys(files);

            return (
              <SandpackLayout>
                <SandpackStack style={{ padding: "10px 0" }}>
                  <CodeEditor
                    code={fileListValues[0].code}
                    filePath={fileListKeys[0]}
                    initMode="immediate"
                    onCodeUpdate={(newCode) => {
                      updateFile(fileListKeys[0], newCode, autoReload);
                    }}
                  />
                </SandpackStack>

                <SandpackStack style={{ padding: "10px 0" }}>
                  <CodeEditor
                    code={fileListValues[1].code}
                    filePath={fileListKeys[1]}
                    initMode="immediate"
                    onCodeUpdate={(newCode) => {
                      updateFile(fileListKeys[1], newCode, autoReload);
                    }}
                  />
                </SandpackStack>

                <SandpackPreview
                  actionsChildren={
                    <button onClick={() => setAutoReload((prev) => !prev)}>
                      Toggle autoReload to {JSON.stringify(!autoReload)}
                    </button>
                  }
                />
              </SandpackLayout>
            );
          }}
        </SandpackConsumer>
      </SandpackProvider>
    </div>
  );
};

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
        <RoundedButton>
          <RefreshIcon />
        </RoundedButton>
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
  const id = useId();

  useEffect(() => {
    // eslint-disable-next-line no-console
    const unsubscribe = listen((msg) => console.log(id, msg));

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
      <SandpackProvider
        options={{ autorun: true, autoReload: true }}
        template="static"
      >
        {new Array(listenersCount).fill(" ").map((pr, index) => (
          <SandpackListener key={index} />
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

export const ClosableTabs: React.FC = () => (
  <Sandpack
    options={{ closableTabs: true, visibleFiles: ["/App.js", "/index.js"] }}
    template="react"
  />
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
  const [message, setMessage] = useState("Hello world");
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

export const CustomNpmRegistries: React.FC = () => (
  <Sandpack
    customSetup={{
      dependencies: { "@codesandbox/test-package": "1.0.5" },
      npmRegistries: [
        {
          enabledScopes: ["@codesandbox"],
          limitToScopes: true,
          registryUrl: "https://xywctu-4000.preview.csb.app",
        },
      ],
    }}
    files={{
      "/App.js": `import { Button } from "@codesandbox/test-package"

export default function App() {
  return (
    <div>
      <Button>I'm a private Package</Button>
    </div>
  )
}
`,
    }}
    template="react"
  />
);

export const HiddenHeadTags: React.FC = () => {
  const files = {
    "hidden-test.js": `
function alertTest() {
  alert('Hidden Script Test');
}
`,
    "hidden-test-1.css": `
body {
  background-color: red;
}
`,
    "hidden-test-2.css": `
body {
  background-color: blue;
}
`,
    "index.html": `
<!DOCTYPE html>
<html>

<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="/styles.css" />
</head>

<body class="flex items-center justify-center">
  <button class="p-4 bg-white rounded" onClick="alertTest()">Alert</button>
</body>

</html>
`,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div>Sandpack Component</div>
        <Sandpack
          files={files}
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
              "/hidden-test.js",
              "/hidden-test-1.css",
              "/hidden-test-2.css",
            ],
          }}
          template="static"
        />
      </div>
      <div>
        <div>Sandpack Provider Component</div>
        <SandpackProvider
          files={files}
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
              "/hidden-test.js",
              "/hidden-test-1.css",
              "/hidden-test-2.css",
            ],
          }}
          template="static"
        >
          <SandpackLayout>
            <SandpackFileExplorer />
            <SandpackCodeEditor closableTabs showLineNumbers />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};
