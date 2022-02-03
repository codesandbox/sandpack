import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      options={{ showLineNumbers: true, showNavigator: true, readOnly: true }}
    />
  );
};
