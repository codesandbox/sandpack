import React from "react";

import { SandpackPreview } from "../components/Preview";
import { SandpackLayout } from "../components/common/Layout";
import { SandpackProvider } from "../contexts/sandpackContext";

import { useSandpackNavigation } from "./useSandpackNavigation";

export default {
  title: "hooks/useSandpackNavigation",
};

const CustomRefreshButton: React.FC = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button onClick={refresh} type="button">
      Refresh
    </button>
  );
};

export const CustomCodeEditor = (): React.ReactElement => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview showRefreshButton={false} />
    </SandpackLayout>
    <CustomRefreshButton />
  </SandpackProvider>
);
