import { Sandpack } from "@codesandbox/sandpack-react";

const Home = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="sandpack-dark" />
      <Sandpack theme="github-light" />
    </div>
  );
};

export default Home;
