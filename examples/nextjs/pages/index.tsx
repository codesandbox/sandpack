import type { NextPage } from "next";
import { Sandpack } from "@codesandbox/sandpack-react";

const Home: NextPage = () => {
  return (
    <div>
      <Sandpack />
      <Sandpack theme="sandpack-dark" />
    </div>
  );
};

export default Home;
