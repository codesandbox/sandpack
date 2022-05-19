import { Sandpack } from "./";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      files={{ path: "" }}
      options={{ activePath: "path", openPaths: ["/src/App.vue", "path"] }}
      template="vue"
    />
  );

  // return (
  //   <SandpackProvider template="svelte" options={{activePath: }}>
  //     <SandpackLayout>
  //       <SandpackPreview />
  //     </SandpackLayout>
  //   </SandpackProvider>
  // );
};
