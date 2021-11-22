import { createContext, useContext, useState } from "react";

import { SandpackPreview } from "../common";

const SandpackExampleContext = createContext<{
  setOptions: (opts: Record<string, any>) => void;
  options: Record<string, any>;
}>({
  setOptions: () => {},
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
        setOptions: (payload) =>
          setOptions((prev) => ({ ...prev, ...payload })),
        options,
      }}
    >
      {children}
    </SandpackExampleContext.Provider>
  );
};

export const useSandpackExample = () => useContext(SandpackExampleContext);

export const SandpackExample: React.FC = () => {
  const { options } = useSandpackExample();

  return <SandpackPreview options={options} />;
};
