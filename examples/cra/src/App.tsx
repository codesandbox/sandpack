import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight, sandpackDark } from "@codesandbox/sandpack-themes";
//comment
const Home = () => {
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
