import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { PrismHighlight } from "../../common/PrismHighlight";
import { useTranspiledCode } from "../../hooks/useTranspiledCode";

export const SandpackTranspiledCode: React.FC = () => {
  const transpiledCode = useTranspiledCode();
  const c = useClasser("sp");

  return (
    <div className={c("transpiled-code")}>
      {transpiledCode ? <PrismHighlight code={transpiledCode} /> : null}

      <ErrorOverlay />

      <LoadingOverlay />
    </div>
  );
};
