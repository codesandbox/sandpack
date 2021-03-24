import React from "react";

import { SandpackLayout } from "../common/Layout";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";

import { useActiveCode } from "./useActiveCode";

export default {
  title: "hooks/useActiveCode",
};

const CustomEditor = () => {
  const { code, updateCode } = useActiveCode();
  return (
    <textarea onChange={(evt) => updateCode(evt.target.value)}>{code}</textarea>
  );
};

export const CustomCodeEditor = (): React.ReactElement => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <CustomEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
