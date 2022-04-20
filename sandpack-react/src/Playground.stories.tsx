import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      options={{
        bundlerURL: "https://02079e92.sandpack-bundler.pages.dev/",
      }}
      template="solid-beta"
    />
  );
};
