import React from "react";

import { SandpackLayout } from "../common/Layout";
import { SandpackCodeEditor } from "../components/CodeEditor";
import { SandpackPreview } from "../components/Preview";
import { SandpackProvider } from "../contexts/sandpackContext";

import { useErrorMessage } from "./useErrorMessage";

export default {
  title: "hooks/useErrorMessage",
};

const SenderErrorMessage = () => {
  const { setError } = useErrorMessage();

  return (
    <>
      <button onClick={() => setError([])} type="button">
        Clean errors
      </button>

      <button
        onClick={() =>
          setError((prev) => [
            ...prev,
            {
              message: "new error",
              line: 1,
              column: 2,
            },
          ])
        }
        type="button"
      >
        Add new error
      </button>

      <button
        onClick={() => setError([{ message: "new error" }])}
        type="button"
      >
        Set new error
      </button>
    </>
  );
};

export const Default = (): React.ReactElement => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview showRefreshButton={false} />
    </SandpackLayout>
    <SenderErrorMessage />
  </SandpackProvider>
);
