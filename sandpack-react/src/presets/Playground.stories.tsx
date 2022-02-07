import { Sandpack } from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      files={{
        "Foo.tsx": "",
      }}
      options={{
        activePath: "Foo.tsx",
        openPaths: ["/index.js", "/App.svelte"],
      }}
      template="svelte"
    />
  );
};
