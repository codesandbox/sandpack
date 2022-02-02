import * as React from "react";

import type { SandpackInitMode } from "../..";
import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { CodeEditor } from "../CodeEditor";
import type { CodeEditorRef } from "../CodeEditor";
import type { Decorators } from "../CodeEditor/CodeMirror";
import { FileTabs } from "../FileTabs";

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
    },
    ref
  ) => {
    const { sandpack } = useSandpack();
    const { code } = useActiveCode();

    const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

    return (
      <SandpackStack>
        {shouldShowTabs ? <FileTabs /> : null}

        <CodeEditor
          ref={ref}
          code={propCode ?? code}
          decorators={decorators}
          filePath={sandpack.activePath}
          initMode={initMode || sandpack.initMode}
          showLineNumbers={showLineNumbers}
          showReadOnly={false}
          wrapContent={wrapContent}
          readOnly
        />

        {sandpack.status === "idle" ? <RunButton /> : null}
      </SandpackStack>
    );
  }
);
