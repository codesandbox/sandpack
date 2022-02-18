import React, { useEffect } from "react";
import { useTimer } from "use-timer";
import { SandpackLayout } from "../common";
import { SandpackPreview } from "../components";
import { SandpackProvider } from "../contexts/sandpackContext";
import { useSandpack } from "../hooks";

import { Sandpack } from "./Sandpack";

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

export const ExternalResources: React.FC = () => (
  <Sandpack
    files={{
      "/App.js": `        
export default () => {
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

export const WithCustomLibrary: React.FC = () => <Sandpack template="react" />;

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
            <Sandpack template="react" options={{ initMode: "user-visible" }} />
          </div>
        );
      })}
    </>
  );
};

const Timer: React.FC = () => {
  const { time, start, pause } = useTimer({ interval: 1 });
  const { listen } = useSandpack();

  useEffect(() => {
    const unsub = listen((message) => {
      if (message.type === "start") {
        start();
      } else if (message.type === "done") {
        pause();
      }
    });

    return () => unsub();
  }, []);

  return <>{time}ms</>;
};

export const NewBundler: React.FC = () => {
  return (
    <>
      {new Array(1).fill(" ").map(() => (
        <>
          <SandpackProvider
            template="react"
            bundlerURL="https://sandpack-next.pages.dev"
          >
            <p>
              Bundler v2: <Timer />
            </p>

            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>

          <SandpackProvider template="react">
            <p>
              Bundler v1: <Timer />
            </p>

            <SandpackLayout>
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
        </>
      ))}
    </>
  );
};
