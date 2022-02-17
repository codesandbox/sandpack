import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLightTheme, sandpackDark } from "@codesandbox/sandpack-themes";

const Home = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="dark" />
      <Sandpack theme={githubLightTheme} />
      <Sandpack options={{ readOnly: true }} theme={sandpackDark} />
    </div>
  );
};

export default Home;
