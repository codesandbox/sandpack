import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import React from "react";

import { Sandpack } from "../";
import { REACT_TEMPLATE } from "../templates";

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
      <h1>Hello world</h1>
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

export const Layout: React.FC = () => (
  <>
    <p>Console</p>
    <Sandpack options={{ layout: "console" }} template="node" />

    <p>Tests</p>
    <Sandpack options={{ layout: "tests" }} template="test-ts" />

    <p>Preview</p>
    <Sandpack options={{ layout: "preview" }} template="react" />
  </>
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

export const AutoRun = (): React.ReactElement => (
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

export const AutoReload = (): React.ReactElement => (
  <Sandpack
    files={{
      "/App.js": `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`,
    }}
    options={{
      autorun: true,
      autoReload: false,
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
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
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
          bundlerURL: "https://sandpack-bundler.codesandbox.io",
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
          bundlerURL: "https://sandpack-bundler.codesandbox.io",
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

export const ShowConsoleButton: React.FC = () => (
  <div style={{ width: 800 }}>
    <Sandpack
      files={{
        "/index.js": `${REACT_TEMPLATE.files["/index.js"].code}; 
        
        console.error("Something went wrong");
        
        console.log(function helloWord() {})
        `,
      }}
      options={{
        showConsoleButton: true,
        showConsole: true,
        // editorHeight: 350,
      }}
      template="react"
    />
  </div>
);

export const CustomLanguages: React.FC = () => (
  <Sandpack
    customSetup={{
      entry: "/example.sh",
    }}
    files={{
      "/example.sh": `#!/bin/sh

EXAMPLE="drawn joyed"

# Prints the EXAMPLE variable
function show-example() {
  echo $EXAMPLE
}`,
      "/example.bat": `@echo off 

Rem Prints the "example" variable

set example=Hello world 

echo %example%`,
      "/example.ps1": `$example = "Hello world"

# Prints the "example" variable

Write-Output $example`,
    }}
    options={{
      codeEditor: {
        additionalLanguages: [
          {
            name: "shell",
            extensions: ["sh", "bat", "ps1"],
            language: new LanguageSupport(StreamLanguage.define(shell)),
          },
        ],
      },
    }}
  />
);

export const RtlLayout: React.FC = () => {
  return (
    <>
      <Sandpack
        options={{
          rtl: true,
        }}
        template="react"
      />
    </>
  );
};
