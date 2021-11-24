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
  "/styles.css": `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

.sp-transpiled-code .sp-tabs { 
  display: none;
}

h1 {
  font-size: 1.5rem;
}`,
  "/App.js": `import { SandpackProvider, SandpackThemeProvider, SandpackCodeEditor, SandpackTranspiledCode } from "@codesandbox/sandpack-react";
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
