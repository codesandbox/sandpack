import * as React from "react";

import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { CodeEditor } from "../CodeEditor";
import type { CodeMirrorProps } from "../CodeEditor/CodeMirror";
import { FileTabs } from "../FileTabs";

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  decorators?: CodeMirrorProps["decorators"];
}

export const SandpackCodeViewer: React.FC<CodeViewerProps> = ({
  showTabs,
  showLineNumbers,
  decorators,
}) => {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();

  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  return (
    <SandpackStack>
      {shouldShowTabs ? <FileTabs /> : null}

      <CodeEditor
        code={code}
        decorators={decorators}
        filePath={sandpack.activePath}
        showLineNumbers={showLineNumbers}
        readOnly
      />

      {sandpack.status === "idle" ? <RunButton /> : null}
    </SandpackStack>
  );
};
