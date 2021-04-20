import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";

const reactCode = `export default function App() {
  return <img src="https://placekitten.com/190" alt="Kitten" />;
}
`;

export const App: React.FC = () => {
  return (
    <div>
      <Sandpack
        files={{
          "/App.js": reactCode,
        }}
        options={{
          autorun: true,
          showTabs: true,
          showLineNumbers: true,
          showNavigator: true,
          editorHeight: "calc(100vh - 5px)",
        }}
        template="react"
      />
    </div>
  );
};
