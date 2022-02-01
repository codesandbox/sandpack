import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack />
      <Sandpack customSetup={{ dependencies: { foo: "*" } }} template="react" />
    </>
  );
};
