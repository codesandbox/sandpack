import { useClasser } from "@code-hike/classer";
import * as React from "react";

import type { SandpackInitMode } from "../..";
import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { CodeEditor } from "../CodeEditor";
import type { CodeEditorRef } from "../CodeEditor";
import type { Decorators } from "../CodeEditor/CodeMirror";
import { editorClassName } from "../CodeEditor/styles";
import { FileTabs } from "../FileTabs";

/**
 * @category Components
 */
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
}

/**
 * @category Components
 */
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
      ...props
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code } = useActiveCode();
    const c = useClasser(THEME_PREFIX);

    const shouldShowTabs = showTabs ?? sandpack.visibleFiles.length > 1;

    return (
      <SandpackStack {...props}>
        {shouldShowTabs ? <FileTabs /> : null}

        <div className={classNames(c("code-editor"), editorClassName)}>
          <CodeEditor
            ref={ref}
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
