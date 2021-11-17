import * as React from "react";
import { forwardRef } from "react";

import type { SandpackInitMode } from "../..";
import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { CodeEditor } from "../CodeEditor";
import type { Decorators } from "../CodeEditor/CodeMirror";
import { FileTabs } from "../FileTabs";

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  decorators?: Decorators;
  code?: string;
  initMode?: SandpackInitMode;
}

export const SandpackCodeViewer = forwardRef<HTMLDivElement, CodeViewerProps>(
  (
    {
      showTabs,
      showLineNumbers,
      decorators,
      code: propCode,
      initMode = "user-visible",
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
          initMode={initMode}
          showLineNumbers={showLineNumbers}
          readOnly
        />

        {sandpack.status === "idle" ? <RunButton /> : null}
      </SandpackStack>
    );
  }
);
