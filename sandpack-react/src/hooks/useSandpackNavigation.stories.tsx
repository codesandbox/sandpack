import React from "react";

import { SandpackLayout } from "../common/Layout";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";

import { useSandpackNavigation } from "./useSandpackNavigation";

export default {
  title: "hooks/useSandpackNavigation",
};

const CustomRefreshButton = () => {
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
