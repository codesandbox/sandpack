import { Sandpack } from "@codesandbox/sandpack-react/unstyled";

const App = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="dark" />
      <Sandpack template="nextjs" />
      <Sandpack options={{ readOnly: true }} />
    </div>
  );
};

export default App;
