import { Sandpack } from "./";
import { SandpackPreview } from "./components";
import { SandpackProvider } from "./contexts/sandpackContext";

export default {
  title: "Intro/Playground",
};

export const Main = (): JSX.Element => {
  return (
    <SandpackProvider>
      <SandpackPreview showOpenInCodeSandbox={false} />
    </SandpackProvider>
  );

  return <Sandpack />;
};
