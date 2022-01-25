import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  Sandpack,
} from "../";

import { FileExplorer } from "../components/FileExplorer";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      {/**
      <SandpackProvider sandboxId="bx70k">
        <SandpackLayout>
          <SandpackCodeEditor />
          <SandpackPreview />
        </SandpackLayout>
      </SandpackProvider>

      <Sandpack sandboxId="bx70k" /> */}

      <Sandpack sandboxId="citxd" options={{ openPaths: ["/src/index.tsx"] }} />
    </>
  );
};
