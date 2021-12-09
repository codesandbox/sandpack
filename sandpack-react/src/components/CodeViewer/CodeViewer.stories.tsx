import type { Story } from "@storybook/react";
import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";
import { SandpackThemeProvider } from "../../contexts/themeContext";

import type { CodeViewerProps } from ".";
import { SandpackCodeViewer } from ".";

export default {
  title: "components/Code Viewer",
  component: SandpackCodeViewer,
};

export const Component: Story<CodeViewerProps> = (args) => (
  <SandpackProvider
    customSetup={{
      entry: "/index.js",
      files: {
        "/index.js": {
          code: `const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`,
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeViewer showLineNumbers {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode: React.FC = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="dark">
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const Decorators: React.FC = () => {
  const [itemClick, setItemClicked] = React.useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = React.useRef<any>(null);

  React.useEffect(() => {
    const handle = (event): void => {
      let id = event.target.dataset.id;

      if (!id) {
        id = event.target.parentElement.dataset.id;
      }

      setItemClicked(id);
    };
    const node = ref.current;

    node?.querySelectorAll(".widget").forEach((element) => {
      element.addEventListener("click", handle);
    });

    return (): void => {
      node?.querySelectorAll(".widget").forEach((element) => {
        element.removeEventListener("click", handle);
      });
    };
  });

  return (
    <SandpackProvider
      customSetup={{
        entry: "/index.js",
        files: {
          "/index.js": {
            code: `const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];

export default function List() {
  const [text, setText] = useState("")
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`,
          },
        },
      }}
    >
      <style>
        {`.highlight {
        background: #1ea7fd2b;
        border-radius: 4px;
      }
      .widget {
        border: 1px solid #1ea7fd;
        border-radius: 2px;
        padding: 2px 4px 2px 12px;
        margin-left: 6px;
        position: relative;
        cursor: pointer;
      }

      .widget:before {
        content: attr(data-id);
        background: #1ea7fd;
        border-radius: 100%;
        position: absolute;
        width: 16px;
        display: block;
        height: 16px;
        left: -8px;
        top: 2px;
        font-size: 11px;
        text-align: center;
        color: white;
        line-height: 17px;
      }
      `}
      </style>
      {itemClick && <p>Widget clicked: {itemClick}</p>}
      <SandpackThemeProvider>
        <SandpackCodeViewer
          ref={ref}
          decorators={[
            { className: "highlight", line: 1 },
            { className: "highlight", line: 9 },
            {
              className: "widget",
              elementAttributes: { "data-id": "1" },
              line: 12,
              startColumn: 26,
              endColumn: 38,
            },
            {
              className: "widget",
              elementAttributes: { "data-id": "2" },
              line: 13,
              startColumn: 8,
              endColumn: 17,
            },
          ]}
          showLineNumbers
        />
      </SandpackThemeProvider>
    </SandpackProvider>
  );
};
