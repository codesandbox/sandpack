import { useState, useEffect, useCallback } from "react";
import { SandpackProvider, SandpackCodeEditor, SandpackLayout } from "../";

export default {
  title: "Playground",
};

const Editor = () => {
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (!editorInstance) return;

    const onFocus = () => console.log("onFocus");
    const onBlur = () => console.log("onBlur");

    editorInstance.contentDOM.addEventListener("focus", onFocus);
    editorInstance.contentDOM.addEventListener("blur", onBlur);

    return () => {
      editorInstance.contentDOM.removeEventListener("focus", onFocus);
      editorInstance.contentDOM.removeEventListener("blur", onBlur);
    };
  }, [editorInstance]);

  const setRef = useCallback((node) => {
    if (node?.getCodemirror) {
      setEditorInstance(node.getCodemirror());
    }
  }, []);

  return <SandpackCodeEditor ref={setRef} />;
};

export const Main = (): JSX.Element => {
  return (
    <SandpackProvider>
      <SandpackLayout>
        <Editor />
      </SandpackLayout>
    </SandpackProvider>
  );
};
