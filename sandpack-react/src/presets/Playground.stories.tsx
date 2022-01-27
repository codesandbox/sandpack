import {
  Sandpack,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
} from "../";

import { FileExplorer } from "../components/FileExplorer";

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

      <Sandpack sandboxId="citxd" options={{ activePath: "/src/App.tsx" }} />
    </>
  );
};
