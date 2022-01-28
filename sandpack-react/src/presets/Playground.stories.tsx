import {
  Sandpack,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
  SandpackLayout,
} from "../";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  return (
    <>
      <Sandpack
        files={{ "/package.json": `{ "main": "old-entry.ts" }` }}
        customSetup={{ entry: "new-entry.js" }}
      />
    </>
  );
};
