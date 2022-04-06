import { Sandpack } from "../";
import { SandpackLayout } from "../common";
import { SandpackPreview } from "../components";
import { SandpackProvider } from "../contexts/sandpackContext";

export default {
  title: "Playground",
};

export const Main = (): JSX.Element => {
  // return <Sandpack options={{ showLineNumbers: false }} />;

  return (
    <SandpackProvider>
      <SandpackLayout>
        <SandpackPreview
          viewportOrientation="portrait"
          viewportSize="iPhone X"
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};
