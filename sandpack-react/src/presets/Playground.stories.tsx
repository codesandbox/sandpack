import { Sandpack } from "./Sandpack";

export default {
  title: "Playground",
  component: Sandpack,
};

const code = `export default function App() {
  return '12312312';
};
`;

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      customSetup={{ entry: "/index.tsx", main: "/App.tsx" }}
      files={{ "/App.tsx": code }}
      options={{ showTabs: true, openPaths: ["/index.tsx"] }}
      template="react-ts"
    />
  );
};
