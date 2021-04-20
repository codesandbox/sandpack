import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";

const reactCode = `export default function App() {
  return <img src="https://placekitten.com/190" alt="Kitten" />;
}
`;

export const App: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Sandpack
        files={{
          "/App.js": reactCode,
        }}
        options={{
          autorun: true,
          showTabs: true,
          showLineNumbers: true,
          showNavigator: true,
        }}
        template="react"
      />
    </div>
  );
};
