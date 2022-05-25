import { Sandpack } from "./";

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      files={{
        "./baz": {
          code: "",
        },
      }}
      options={{
        activeFile: "./baz",
        visibleFiles: ["./baz", "/src/App.vue"],
      }}
      template="vue"
    />
  );
};
