import { useClasser } from "@code-hike/classer";
import type { Extension } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import * as React from "react";

import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import type { SandpackInitMode } from "../../types";
import { FileTabs } from "../FileTabs";

import { CodeMirror } from "./CodeMirror";
import type { CodeMirrorRef } from "./CodeMirror";

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
  /**
   * Property to register Codemirror extension keymap.
   */
  extensionsKeymap?: Array<readonly KeyBinding[]>;
  id?: string;
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
      extensionsKeymap,
      id,
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
            extensions={extensions}
            extensionsKeymap={extensionsKeymap}
            filePath={activePath}
            id={id}
            initMode={initMode || sandpack.initMode}
            onCodeUpdate={handleCodeUpdate}
            showInlineErrors={showInlineErrors}
            showLineNumbers={showLineNumbers}
            wrapContent={wrapContent}
          />

          {showRunButton && status === "idle" ? <RunButton /> : null}
        </div>
      </SandpackStack>
    );
  }
);
