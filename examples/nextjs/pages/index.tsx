import { Sandpack } from "@codesandbox/sandpack-react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="sandpack-dark" />
      <Sandpack theme="github-light" />
      <Sandpack options={{ readOnly: true }} theme="github-light" />
    </div>
  );
};

export default Home;
