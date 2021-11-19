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
  const [options, setOptions] = useState({});

  return (
    <SandpackExampleContext.Provider value={{ setOptions, options }}>
      {children}
    </SandpackExampleContext.Provider>
  );
};

export const useSandpackExample = () => useContext(SandpackExampleContext);

export const SandpackExample: React.FC = () => {
  const { options } = useSandpackExample();

  return <SandpackPreview options={options} />;
};
