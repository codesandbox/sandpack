import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack
        theme="dark"
        template="react"
        options={{
          showLineNumbers: true,
          showNavigator: true,
          showInlineErrors: true,
        }}
      />
      <br />
      <br />
      <Sandpack
        template="react"
        options={{
          showLineNumbers: true,
          showNavigator: true,
          showInlineErrors: true,
        }}
      />
    </>
  );
};
