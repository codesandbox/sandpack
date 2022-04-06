import { Sandpack } from "../";
import { SandpackLayout } from "../common";
import { SandpackPreview } from "../components";
import { SandpackProvider } from "../contexts/sandpackContext";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <Sandpack
      template="svelte"
      options={{ showLineNumbers: false, activePath: "" }}
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
