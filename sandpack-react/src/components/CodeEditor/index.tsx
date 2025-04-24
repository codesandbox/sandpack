import type { Extension } from "@codemirror/state";
import type { KeyBinding } from "@codemirror/view";
import { forwardRef, useEffect, useRef, useState } from "react";

import { useSandbox } from "../../contexts/SandpackSandboxContext";
import { useSandpackState } from "../../contexts/SandpackStateContext";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import type { CustomLanguage, SandpackInitMode } from "../../types";
import { useClassNames } from "../../utils/classNames";
import { useSandpackId } from "../../utils/useAsyncSandpackId";
import { FileTabs } from "../FileTabs";
import { RunButton } from "../common/RunButton";
import { SandpackStack } from "../common/Stack";

import { CodeMirror } from "./CodeMirror";
import type { CodeMirrorRef } from "./CodeMirror";
import { editorClassName } from "./styles";
export type CodeEditorRef = CodeMirrorRef;

export interface CodeEditorProps {
  style?: React.CSSProperties;
  className?: string;
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

export const SandpackCodeEditor = forwardRef<CodeMirrorRef, CodeEditorProps>(
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
      className,
      ...props
    },
    ref
  ) => {
    const { environment: env } = useSandbox();
    const useCodeRef = useRef("");
    const state = useSandpackState();
    const [code, setCode] = useState("");
    // const { code, updateCode, readOnly: readOnlyFile } = useActiveCode();
    const shouldShowTabs = false; // showTabs ?? sandpack.visibleFiles.length > 1;
    const classNames = useClassNames();

    useEffect(() => {
      if (state?.activeFile) {
        env.fs.readFile(state.activeFile).then((content) => {
          const code =
            typeof content === "string"
              ? content
              : new TextDecoder("utf-8").decode(content);

          useCodeRef.current = code;

          setCode(code);
        });
      }
    }, [state?.activeFile]);

    useEffect(() => {
      const saveListener = async (event: KeyboardEvent) => {
        if (
          state.activeFile &&
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === "s"
        ) {
          event.preventDefault();

          const content = useCodeRef.current;
          const metadata = env.fs.readFileMetadata(state.activeFile);
          await state.triggerChange({
            type: "update",
            path: state.activeFile,
            content,
            metadata,
          });
          env.fs.writeFile(state.activeFile, useCodeRef.current);
        }
      };

      window.addEventListener("keydown", saveListener);

      return () => {
        window.removeEventListener("keydown", saveListener);
      };
    }, [state]);

    const handleCodeUpdate = async (newCode: string) => {
      useCodeRef.current = newCode;

      if (env.type === "vm" || !state?.activeFile) {
        return;
      }

      env.fs.writeFile(state.activeFile, newCode);
    };

    if (!state.activeFile) {
      return null;
    }

    return (
      <SandpackStack className={classNames("editor", [className])} {...props}>
        {shouldShowTabs && <FileTabs closableTabs={closableTabs} />}

        <div
          aria-labelledby={`${state.activeFile}-tab`}
          className={classNames("code-editor", [editorClassName])}
          id={`${state.activeFile}-tab-panel`}
          role="tabpanel"
        >
          <CodeMirror
            key={state.activeFile}
            ref={ref}
            additionalLanguages={additionalLanguages}
            code={code}
            editorState="pristine"
            extensions={extensions}
            extensionsKeymap={extensionsKeymap}
            filePath={state.activeFile}
            // TODO: Rather pass component specific options from the top always
            initMode={"immediate" /*initMode || sandpack.initMode*/}
            onCodeUpdate={(newCode: string) => handleCodeUpdate(newCode)}
            readOnly={false /*readOnly || readOnlyFile*/}
            showInlineErrors={showInlineErrors}
            showLineNumbers={showLineNumbers}
            showReadOnly={showReadOnly}
            wrapContent={wrapContent}
          />

          {/*showRunButton && (!sandpack.autoReload || status === "idle") ? (
            <RunButton />
          ) : null*/}
        </div>
      </SandpackStack>
    );
  }
);
