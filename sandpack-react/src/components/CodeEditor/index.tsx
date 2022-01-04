import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import type { SandpackInitMode } from "../../types";
import { FileTabs } from "../FileTabs";

import { CodeMirror } from "./CodeMirror";
import type { CodeMirrorRef } from "./CodeMirror";
import { Extension } from "@codemirror/state";

export type CodeEditorRef = CodeMirrorRef;
export interface CodeEditorProps {
  customStyle?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  showInlineErrors?: boolean;
  showRunButton?: boolean;
  wrapContent?: boolean;
  closableTabs?: boolean;
  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  /**
   * Codemirror extensions for the editor state, which can
   * provide extra features and functionalities to the editor component.
   */
  extensions?: Extension[];
}

export { CodeMirror as CodeEditor };

/**
 * @category Components
 */
export const SandpackCodeEditor = React.forwardRef<
  CodeMirrorRef,
  CodeEditorProps
>(
  (
    {
      customStyle,
      showTabs,
      showLineNumbers = false,
      showInlineErrors = false,
      showRunButton = true,
      wrapContent = false,
      closableTabs = false,
      initMode,
      extensions,
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code, updateCode } = useActiveCode();
    const { activePath, status, editorState } = sandpack;
    const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

    const c = useClasser("sp");

    const handleCodeUpdate = (newCode: string): void => {
      updateCode(newCode);
    };

    return (
      <SandpackStack customStyle={customStyle}>
        {shouldShowTabs ? <FileTabs closableTabs={closableTabs} /> : null}

        <div className={c("code-editor")}>
          <CodeMirror
            key={activePath}
            ref={ref}
            code={code}
            editorState={editorState}
            filePath={activePath}
            initMode={initMode || sandpack.initMode}
            onCodeUpdate={handleCodeUpdate}
            showInlineErrors={showInlineErrors}
            showLineNumbers={showLineNumbers}
            wrapContent={wrapContent}
            extensions={extensions}
          />

          {showRunButton && status === "idle" ? <RunButton /> : null}
        </div>
      </SandpackStack>
    );
  }
);
