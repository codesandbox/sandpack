import { createContext, useContext, useState } from "react";

interface Context {
  layoutFiles: Record<string, string>;
  setLayoutFiles: (filename: string, code: string) => void;
  visibility: boolean;
  setVisibility: (value: boolean) => void;
}

const LayoutContext = createContext<Context>({
  layoutFiles: {},
  setLayoutFiles: () => {
    return;
  },
  visibility: false,
  setVisibility: () => {
    return;
  },
});

export const useLayoutExampleContext = (): Context => useContext(LayoutContext);

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
      <SandpackCodeEditor showTabs={false} />
      <SandpackTranspiledCode showTabs={false} />
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
        setLayoutFiles: (filename, code): void =>
          setLayoutFiles((prev) => ({ ...prev, [filename]: code })),
        visibility,
        setVisibility,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
