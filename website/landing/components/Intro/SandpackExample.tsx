import { createContext, useContext, useState } from "react";

import { SandpackPreview } from "../common";

interface Context {
  setOptions: (opts: Record<string, unknown>) => void;
  options: Record<string, unknown>;
}

const SandpackExampleContext = createContext<Context>({
  setOptions: () => {
    return;
  },
  options: {},
});

export const SandpackExampleProvider: React.FC = ({ children }) => {
  const [options, setOptions] = useState({
    options: {
      showNavigator: true,
      showLineNumbers: true,
      showTabs: true,
      closableTabs: true,
    },
  });

  return (
    <SandpackExampleContext.Provider
      value={{
        setOptions: (payload): void =>
          setOptions((prev) => ({ ...prev, ...payload })),
        options,
      }}
    >
      {children}
    </SandpackExampleContext.Provider>
  );
};

export const useSandpackExample = (): Context =>
  useContext(SandpackExampleContext);

export const SandpackExample: React.FC = () => {
  const { options } = useSandpackExample();

  return <SandpackPreview options={options} />;
};
