import * as React from "react";

import { PrismHighlight } from "../../common/PrismHighlight";
import { RunButton } from "../../common/RunButton";
import { SandpackStack } from "../../common/Stack";
import { useActiveCode } from "../../hooks/useActiveCode";
import { useSandpack } from "../../hooks/useSandpack";
import { FileTabs } from "../FileTabs";

import { getPrismLanguage } from "./utils";

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
}

export const SandpackCodeViewer: React.FC<CodeViewerProps> = ({
  showTabs,
  showLineNumbers,
}) => {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { activePath, status } = sandpack;

  const lang = getPrismLanguage(activePath);
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  return (
    <SandpackStack>
      {shouldShowTabs && <FileTabs />}
      <PrismHighlight
        code={code}
        lang={lang}
        showLineNumbers={showLineNumbers}
      />
      {status === "idle" && <RunButton />}
    </SandpackStack>
  );
};
