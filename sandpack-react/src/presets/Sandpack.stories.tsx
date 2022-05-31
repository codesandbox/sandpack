import React from "react";

import { useSandboxData } from "../hooks/useSandboxData";
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
      bundlerURL: "https://sandpack-bundler.pages.dev",
    }}
    template="react"
  />
);

export const CodesandboxData: React.FC = () => {
  const { data, error, isLoading } = useSandboxData(
    "kc88v1",
    "https://codesandbox.io/api"
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading sandbox...</div>;
  }

  if (!data) {
    return <div>Could not load sandbox</div>;
  }

  const files = data.files;
  return (
    <Sandpack
      files={{ "/package.json": files["/package.json"] }}
      options={{
        fileResolver: {
          isFile: (path: string): Promise<boolean> => {
            return Promise.resolve(!!files[path]);
          },
          readFile: (path: string): Promise<string> => {
            const code = files[path]?.code;
            if (code === undefined) {
              return Promise.reject(new Error("File not found"));
            }
            return Promise.resolve(files[path]?.code);
          },
        },
        showLineNumbers: true,
        showInlineErrors: true,
        bundlerURL: "https://sandpack-bundler.pages.dev",
      }}
      template="react"
    />
  );
};

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
