import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <SandpackProvider sandboxId="bx70k">
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>

      <Sandpack sandboxId="uo1h0" />

      <Sandpack options={{ activePath: "/src/App.tsx" }} sandboxId="citxd" />
    </>
  );
};
