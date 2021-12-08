import { SandpackCodeEditor, SandpackPreview } from "..";
import { SandpackProvider, SandpackLayout, SandpackThemeProvider } from "../..";

import { SandpackReactDevTools } from "./";

export default {
  title: "components/ReactDevTools",
};

export const ReactDevTool: React.FC = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
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
