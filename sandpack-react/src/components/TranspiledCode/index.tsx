import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { PrismHighlight } from "../../common/PrismHighlight";
import { useSandpack } from "../../hooks/useSandpack";
import { useTranspiledCode } from "../../hooks/useTranspiledCode";

export const SandpackTranspiledCode: React.FC = () => {
  const { sandpack } = useSandpack();
  const transpiledCode = useTranspiledCode();
  const c = useClasser("sp");

  const hiddenIframeRef = React.useRef<HTMLIFrameElement | null>(null);
  React.useEffect(() => {
    const hiddenIframe = hiddenIframeRef.current!;
    sandpack.registerBundler(hiddenIframe, "hidden");
    return () => {
      sandpack.unregisterBundler("hidden");
    };
  }, []);

  return (
    <div className={c("transpiled-code")}>
      {transpiledCode ? <PrismHighlight code={transpiledCode} /> : null}
      <iframe ref={hiddenIframeRef} style={{ display: "none" }} />
      <ErrorOverlay />
      <LoadingOverlay clientId="hidden" />
    </div>
  );
};
