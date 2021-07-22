import { useClasser } from "@code-hike/classer";
import * as React from "react";
import type { Diagnostic } from "@codemirror/lint";

import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { FileTabs } from "../FileTabs";

import { CodeMirror } from "./CodeMirror";

export interface CodeEditorProps {
  customStyle?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showRunButton?: boolean;
  wrapContent?: boolean;
  onCodeUpdate?: (code: string) => void;
  lintDiagnostics?: Diagnostic[];
}

export { CodeMirror as CodeEditor };

export const SandpackCodeEditor: React.FC<CodeEditorProps> = ({
  customStyle,
  showTabs,
  showLineNumbers = false,
  showInlineErrors = false,
  showRunButton = true,
  wrapContent = false,
  onCodeUpdate,
  lintDiagnostics,
}) => {
  const { sandpack } = useSandpack();
  const { code, updateCode } = useActiveCode();
  const { activePath, status, editorState } = sandpack;
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  const c = useClasser("sp");

  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);

    onCodeUpdate?.(newCode);
  };

  return (
    <SandpackStack customStyle={customStyle}>
      {shouldShowTabs ? <FileTabs /> : null}

      <div className={c("code-editor")}>
        <CodeMirror
          key={activePath}
          code={code}
          editorState={editorState}
          filePath={activePath}
          lintDiagnostics={lintDiagnostics}
          onCodeUpdate={handleCodeUpdate}
          showInlineErrors={showInlineErrors}
          showLineNumbers={showLineNumbers}
          wrapContent={wrapContent}
        />

        {showRunButton && status === "idle" ? <RunButton /> : null}
      </div>
    </SandpackStack>
  );
};
