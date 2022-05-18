import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";

const Home: React.FC = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="dark" />
      <Sandpack theme={githubLight} />
      <Sandpack options={{ readOnly: true }} theme={sandpackDark} />
    </div>
  );
};

export default Home;
