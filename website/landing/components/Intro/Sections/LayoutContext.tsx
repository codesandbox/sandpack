import { createContext, useContext, useState } from "react";

const LayoutContext = createContext<{
  layoutFiles: Record<string, string>;
  setLayoutFiles: (filename: string, code: string) => void;
  visibility: boolean;
  setVisibility: (value: boolean) => void;
}>({
  layoutFiles: {},
  setLayoutFiles: () => {},
  visibility: false,
  setVisibility: () => {},
});

export const useLayoutExampleContext = () => useContext(LayoutContext);

const ORIGINAL_CODE = {
  "/App.js": `import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackCodeEditor,
  SandpackTranspiledCode,
} from "@codesandbox/sandpack-react";
import "@codesandbox/sandpack-react/dist/index.css";

export default () => (
  <SandpackProvider template="vanilla">
    <SandpackThemeProvider>
      <SandpackCodeEditor />
      <SandpackTranspiledCode />
    </SandpackThemeProvider>
  </SandpackProvider>
);

// ✨ BTW, all examples are built in Sandpack`,
};

export const LayoutExampleProvider: React.FC = ({ children }) => {
  const [layoutFiles, setLayoutFiles] = useState(ORIGINAL_CODE);
  const [visibility, setVisibility] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        layoutFiles,
        setLayoutFiles: (filename, code) =>
          setLayoutFiles((prev) => ({ ...prev, [filename]: code })),
        visibility,
        setVisibility,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
