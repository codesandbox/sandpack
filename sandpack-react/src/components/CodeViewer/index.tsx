import * as React from "react";

import type { CustomLanguage, SandpackInitMode } from "../..";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { useClassNames } from "../../utils/classNames";
import { useSandpackId } from "../../utils/useAsyncSandpackId";
import { CodeEditor } from "../CodeEditor";
import type { CodeEditorRef } from "../CodeEditor";
import type { Decorators } from "../CodeEditor/CodeMirror";
import { editorClassName } from "../CodeEditor/styles";
import { FileTabs } from "../FileTabs";
import { RunButton } from "../common/RunButton";
import { SandpackStack } from "../common/Stack";

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  /**
   * Provides a way to draw or style a piece of the content.
   */
  decorators?: Decorators;
  code?: string;
  wrapContent?: boolean;
  /**
   * This provides a way to control how some components are going to
   * be initialized on the page. The CodeEditor and the Preview components
   * are quite expensive and might overload the memory usage, so this gives
   * a certain control of when to initialize them.
   */
  initMode?: SandpackInitMode;
  /**
   * Provides a way to add custom language modes by supplying a language
   * type, applicable file extensions, and a LanguageSupport instance
   * for that syntax mode
   */
  additionalLanguages?: CustomLanguage[];
}

export const SandpackCodeViewer = React.forwardRef<
  CodeEditorRef,
  CodeViewerProps
>(
  (
    {
      showTabs,
      showLineNumbers,
      decorators,
      code: propCode,
      initMode,
      wrapContent,
      additionalLanguages,
      ...props
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code } = useActiveCode();
    const classNames = useClassNames();

    const shouldShowTabs = showTabs ?? sandpack.visibleFiles.length > 1;

    const activeFileUniqueId = useSandpackId();

    return (
      <SandpackStack className={classNames("editor-viewer")} {...props}>
        {shouldShowTabs ? (
          <FileTabs activeFileUniqueId={activeFileUniqueId} />
        ) : null}

        <div
          aria-labelledby={`${sandpack.activeFile}-${activeFileUniqueId}-tab`}
          className={classNames("code-editor", [editorClassName])}
          id={`${sandpack.activeFile}-${activeFileUniqueId}-tab-panel`}
          role="tabpanel"
        >
          <CodeEditor
            ref={ref}
            additionalLanguages={additionalLanguages}
            code={propCode ?? code}
            decorators={decorators}
            filePath={sandpack.activeFile}
            initMode={initMode || sandpack.initMode}
            showLineNumbers={showLineNumbers}
            showReadOnly={false}
            wrapContent={wrapContent}
            readOnly
          />
        </div>

        {sandpack.status === "idle" ? <RunButton /> : null}
      </SandpackStack>
    );
  }
);
