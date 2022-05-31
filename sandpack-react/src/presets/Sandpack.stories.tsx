import React from "react";

import { Sandpack } from "../";

export default {
  title: "presets/Sandpack: options",
  component: Sandpack,
};

export const Main: React.FC = () => (
  <Sandpack
    files={{
      "/App.js": `import Button from './button';
import Link from './link';

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button />
      <Link />
    </div>
  )
}`,
      "/button.js": `export default function Button() {
  return <button>Click me</button>
}
`,
      "/link.js": `export default function Link() {
  return <a href="https://www.example.com" target="_blank">Click Here</a>
}`,
    }}
    options={{
      showLineNumbers: true,
      showInlineErrors: true,
    }}
    template="react"
  />
);

export const CustomSetup: React.FC = () => (
  <Sandpack
    customSetup={{
      entry: "/src/index.tsx",
      dependencies: {
        react: "latest",
        "react-dom": "latest",
        "react-scripts": "4.0.0",
      },
    }}
    files={{
      "./tsconfig.json": {
        code: `{
"include": [
  "./src/**/*"
],
"compilerOptions": {
  "strict": true,
  "esModuleInterop": true,
  "lib": [
    "dom",
    "es2015"
  ],
  "jsx": "react"
}
}`,
        hidden: true,
      },
      "/public/index.html": {
        code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<div id="root"></div>
</body>
</html>`,
        hidden: true,
      },

      "/src/index.tsx": {
        code: `import * as React from "react";
import { render } from "react-dom";

import { Main } from "./main";

const rootElement = document.getElementById("root");
render(<Main test="World"/>, rootElement);
        `,
        hidden: true,
      },

      "/src/main.tsx": {
        code: `import * as React from "react";

export const Main: React.FC<{test: string}> = ({test}) => {
  return (
    <h1>Hello {test}</h1>
  )
}`,
      },
    }}
    options={{ wrapContent: true, activeFile: "/src/main.tsx" }}
    theme="dark"
  />
);

export const ExternalResources: React.FC = () => (
  <Sandpack
    files={{
      "/App.js": `export default () => {
  return <a
    href="#"
    className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
  >
    Log in
  </a>
}`,
    }}
    options={{
      externalResources: [
        "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
      ],
    }}
    template="react"
  />
);

export const RunnableComponent = (): React.ReactElement => (
  <Sandpack
    files={{
      "/App.js": `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`,
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

export const InitModeUserVisible: React.FC = () => {
  return (
    <>
      {new Array(30).fill(" ").map((_, index) => {
        return (
          <div key={index} style={{ marginBottom: 200 }}>
            <Sandpack options={{ initMode: "user-visible" }} />
          </div>
        );
      })}
    </>
  );
};

export const ShowLineNumber: React.FC = () => (
  <Sandpack options={{ showLineNumbers: true }} template="react" />
);

export const wrapContent: React.FC = () => (
  <Sandpack options={{ wrapContent: true }} template="vanilla" />
);

const defaultFiles = {
  "/styles.css": `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`,
  "/index.js": `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
  "/package.json": `{
  "name": "test-sandbox",
  "main": "/index.js",
  "private": true,
  "scripts": {},
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^4.0.0"
  }
}
`,
};

const filesA = {
  "/App.js": `import "./styles.css";
  
export default function App() {
  return <h1>File A</h1>
}`,
};

const filesB = {
  "/App.js": `import "./styles.css";
  
export default function App() {
  return <h1>File B</h1>
}`,
};

export const FileResolver = (): JSX.Element => {
  return (
    <>
      <Sandpack
        customSetup={{
          environment: "create-react-app",
          entry: "/index.js",
        }}
        files={defaultFiles}
        options={{
          bundlerURL: "https://1ad528b9.sandpack-bundler.pages.dev",
          fileResolver: {
            isFile: async (fileName): Promise<boolean> =>
              new Promise((resolve) => resolve(!!filesA[fileName])),
            readFile: async (fileName): Promise<string> =>
              new Promise((resolve) => resolve(filesA[fileName])),
          },
        }}
      />

      <Sandpack
        customSetup={{
          environment: "create-react-app",
          entry: "/index.js",
        }}
        files={defaultFiles}
        options={{
          bundlerURL: "https://1ad528b9.sandpack-bundler.pages.dev",
          fileResolver: {
            isFile: async (fileName): Promise<boolean> =>
              new Promise((resolve) => resolve(!!filesB[fileName])),
            readFile: async (fileName): Promise<string> =>
              new Promise((resolve) => resolve(filesB[fileName])),
          },
        }}
      />
    </>
  );
};
