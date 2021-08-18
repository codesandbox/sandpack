import type { Story } from "@storybook/react";
import React from "react";

import { SandpackProvider, SandpackLayout, SandpackStack } from "..";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackPreview } from "../components/Preview";
import { useSandpack } from "../hooks/useSandpack";
import { codesandboxDarkTheme } from "../themes";

import type { SandpackProps } from "./Sandpack";
import { Sandpack } from "./Sandpack";

export default {
  title: "presets/Sandpack",
  component: Sandpack,
};

const reactCode = `import Button from './button';
import Link from './link';

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button />
      <Link />
    </div>
  )
}
`;

const buttonCode = `export default function Button() {
  return <button>Click me</button>
}
`;

const linkCode = `export default function Link() {
  return <a href="https://www.example.com" target="_blank">Click Here</a>
}`;

export const ReactEditor: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    files={{
      "/App.js": reactCode,
      "/button.js": buttonCode,
      "/link.js": linkCode,
    }}
    options={{
      showLineNumbers: true,
      showInlineErrors: true,
    }}
    template="react"
  />
);

export const VueEditor: Story<SandpackProps> = (args) => (
  <Sandpack {...args} template="vue" theme="aqua-blue" />
);

export const VanillaEditor: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    options={{
      openPaths: ["/src/index.js", "/src/styles.css", "/index.html"],
      showNavigator: true,
    }}
    template="vanilla"
    theme="codesandbox-dark"
  />
);

export const AngularEditor: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    options={{
      openPaths: [
        "/src/app/app.component.css",
        "/src/app/app.component.html",
        "/src/app/app.component.ts",
      ],
    }}
    template="angular"
    theme="monokai-pro"
  />
);

export const Vue3Editor: Story<SandpackProps> = (args) => (
  <Sandpack {...args} template="vue3" />
);

export const DarkTheme: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    files={{
      "/App.js": reactCode,
      "/button.js": {
        code: buttonCode,
      },
      "/link.js": {
        code: linkCode,
        hidden: true,
      },
    }}
    template="react"
    theme="codesandbox-dark"
  />
);

export const CustomSetup: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    customSetup={{
      entry: "/src/index.tsx",
      main: "/src/main.tsx",
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
    options={{ wrapContent: true }}
    theme="night-owl"
  />
);

const reactWithLibCode = `import ReactMarkdown from 'react-markdown' 

export default function App() {
  return <ReactMarkdown># Hello, *world*!</ReactMarkdown>
}`;

export const WithCustomLibrary: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    customSetup={{
      dependencies: {
        "react-markdown": "latest",
      },
    }}
    files={{
      "/App.js": reactWithLibCode,
    }}
    template="react"
  />
);

export const WithClosableTabs: Story<SandpackProps> = (args) => (
  <Sandpack
    {...args}
    customSetup={{
      dependencies: {
        "react-markdown": "latest",
      },
    }}
    files={{
      "/App.js": reactWithLibCode,
    }}
    options={{
      closableTabs: true,
    }}
    template="react"
  />
);

export const MultipleInstances: Story<SandpackProps> = (args) => (
  <div>
    <h2>Light Theme</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
    />
    <h2>Dark Theme</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="codesandbox-dark"
    />
    <h2>Night Owl</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="night-owl"
    />
    <h2>Aqua Theme</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="aqua-blue"
    />
    <h2>Monokai Theme</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="monokai-pro"
    />
    <h2>Custom Theme Colors</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme={{
        palette: {
          accent: "#fc0e34",
          inactiveText: "#aaa",
        },
        syntax: {
          keyword: "#6700ff",
        },
      }}
    />
    <h2>Custom Theme Typography</h2>
    <Sandpack
      {...args}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme={{
        ...codesandboxDarkTheme,
        typography: {
          fontSize: "16px",
          bodyFont: "Arial",
        },
      }}
    />
    <h2>Theme - Auto</h2>
    <p>Selects theme using system preference</p>
    <Sandpack
      options={{ showTabs: true, showNavigator: true }}
      template="react"
      theme="auto"
    />
  </div>
);

const code = `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`;

export const RunnableComponent = (): React.ReactElement => (
  <Sandpack
    files={{
      "/App.js": code,
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

const ResetButton = () => {
  const { sandpack } = useSandpack();

  return (
    <button
      className="sp-tab-button"
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

const ResetCurrentFileButton = () => {
  const { sandpack } = useSandpack();

  return (
    <button
      className="sp-tab-button"
      onClick={() => sandpack.resetFile(sandpack.activePath)}
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

export const WithResetButton: React.FC = () => (
  <>
    <SandpackProvider
      customSetup={{
        files: {
          "/App.js": reactCode,
          "/button.js": buttonCode,
          "/link.js": linkCode,
        },
      }}
      template="react"
    >
      <SandpackLayout>
        <div
          className="sp-stack"
          style={{ position: "relative", width: "100%" }}
        >
          <SandpackCodeEditor />
          <ResetButton />
        </div>
        <SandpackStack>
          <SandpackPreview />
        </SandpackStack>
      </SandpackLayout>
    </SandpackProvider>

    <SandpackProvider
      customSetup={{
        files: {
          "/App.js": reactCode,
          "/button.js": buttonCode,
          "/link.js": linkCode,
        },
      }}
      template="react"
    >
      <SandpackLayout>
        <div
          className="sp-stack"
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
