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
      files={{ "/App.tsx": { code, readOnly: true } }}
      options={{ showTabs: true }}
      template="react-ts"
    />
  );
};
