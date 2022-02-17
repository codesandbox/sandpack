import { Sandpack, SandpackProvider } from "../";
import { SandpackCodeEditor } from "../components";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack
        files={{
          "Foo.tsx": "",
        }}
        options={{
          activePath: "Foo.tsx",
          openPaths: ["/index.js", "Foo.tsx"],
          showNavigator: true,
        }}
        template="react"
      />
      <SandpackProvider
        files={{
          dawada: "",
        }}
        options={{
          activePath: "dawada",
          openPaths: ["/index.js", "/App.svelte", "dawada"],
          initMode: "immediate",
        }}
        template="svelte"
      >
        <SandpackCodeEditor />
      </SandpackProvider>
    </>
  );
};
