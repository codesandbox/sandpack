import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack template={{ sandboxId: "bx70k" }} />
      <Sandpack
        template={{ sandboxId: "uo1h0" }}
        customSetup={{ dependencies: { foo: "*" } }}
      />
    </>
  );
};
