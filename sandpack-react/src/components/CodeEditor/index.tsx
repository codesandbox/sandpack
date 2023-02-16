import { useClasser } from "@code-hike/classer";
import type { Extension } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import * as React from "react";

import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { THEME_PREFIX } from "../../styles";
import type { CustomLanguage, SandpackInitMode } from "../../types";
import { classNames } from "../../utils/classNames";
import { FileTabs } from "../FileTabs";
import { RunButton } from "../common/RunButton";
import { SandpackStack } from "../common/Stack";

import { CodeMirror } from "./CodeMirror";
import type { CodeMirrorRef } from "./CodeMirror";
import { editorClassName } from "./styles";
export type CodeEditorRef = CodeMirrorRef;

export interface CodeEditorProps {
  style?: React.CSSProperties;
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
   * CodeMirror extensions for the editor state, which can
   * provide extra features and functionalities to the editor component.
   */
  extensions?: Extension[];
  /**
   * Property to register CodeMirror extension keymap.
   */
  extensionsKeymap?: KeyBinding[];
  /**
   * This disables editing of the editor content by the user.
   */
  readOnly?: boolean;
  /**
   * Controls the visibility of Read-only label, which will only
   * appears when `readOnly` is `true`
   */
  showReadOnly?: boolean;
  /**
   * Provides a way to add custom language modes by supplying a language
   * type, applicable file extensions, and a LanguageSupport instance
   * for that syntax mode
   */
  additionalLanguages?: CustomLanguage[];
}

export { CodeMirror as CodeEditor };

export const SandpackCodeEditor = React.forwardRef<
  CodeMirrorRef,
  CodeEditorProps
>(
  (
    {
      showTabs,
      showLineNumbers = false,
      showInlineErrors = false,
      showRunButton = true,
      wrapContent = false,
      closableTabs = false,
      initMode,
      extensions,
      extensionsKeymap,
      readOnly,
      showReadOnly,
      additionalLanguages,
      ...props
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code, updateCode, readOnly: readOnlyFile } = useActiveCode();
    const { activeFile, status, editorState } = sandpack;
    const shouldShowTabs = showTabs ?? sandpack.visibleFiles.length > 1;

    const c = useClasser(THEME_PREFIX);

    const handleCodeUpdate = (newCode: string): void => {
      updateCode(newCode);
    };

    return (
      <SandpackStack className={c("editor")} {...props}>
        {shouldShowTabs && <FileTabs closableTabs={closableTabs} />}

        <div className={classNames(c("code-editor"), editorClassName)}>
          <CodeMirror
            key={activeFile}
            ref={ref}
            additionalLanguages={additionalLanguages}
            code={code}
            editorState={editorState}
            extensions={extensions}
            extensionsKeymap={extensionsKeymap}
            filePath={activeFile}
            initMode={initMode || sandpack.initMode}
            onCodeUpdate={handleCodeUpdate}
            readOnly={readOnly || readOnlyFile}
            showInlineErrors={showInlineErrors}
            showLineNumbers={showLineNumbers}
            showReadOnly={showReadOnly}
            wrapContent={wrapContent}
          />

          {showRunButton && status === "idle" ? <RunButton /> : null}
        </div>
      </SandpackStack>
    );
  }
);
