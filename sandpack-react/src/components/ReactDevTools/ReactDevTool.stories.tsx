import { useEffect } from "react";
import { SandpackCodeEditor, SandpackPreview } from "..";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackThemeProvider,
  useSandpack,
} from "../..";

import { SandpackReactDevTools } from "./";

export default {
  title: "components/ReactDevTools",
};

const Listener = () => {
  const { listen } = useSandpack();

  useEffect(() => {
    listen(console.log);
  }, []);

  return null;
};

export const ReactDevTool: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <Listener />
      <SandpackLayout>
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>

      <SandpackLayout style={{ marginTop: 12 }}>
        <SandpackReactDevTools />
      </SandpackLayout>
    </SandpackThemeProvider>
  </SandpackProvider>
);
