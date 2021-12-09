import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { useSandpack } from "../../hooks/useSandpack";
import { useTranspiledCode } from "../../hooks/useTranspiledCode";
import type { CodeViewerProps } from "../CodeViewer";
import { SandpackCodeViewer } from "../CodeViewer";

/**
 * @category Components
 */
export const SandpackTranspiledCode = (props: CodeViewerProps): JSX.Element => {
  const { sandpack } = useSandpack();
  const transpiledCode = useTranspiledCode();
  const c = useClasser("sp");

  const hiddenIframeRef = React.useRef<HTMLIFrameElement | null>(null);
  React.useEffect(() => {
    const hiddenIframe = hiddenIframeRef.current;

    if (hiddenIframe) {
      sandpack.registerBundler(hiddenIframe, "hidden");
    }
    return (): void => {
      sandpack.unregisterBundler("hidden");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={c("transpiled-code")}>
      {transpiledCode && (
        <SandpackCodeViewer
          code={transpiledCode}
          initMode={sandpack.initMode}
          {...props}
        />
      )}
      <iframe
        ref={hiddenIframeRef}
        style={{ display: "none" }}
        title="transpiled sandpack code"
      />
      <ErrorOverlay />
      <LoadingOverlay clientId="hidden" />
    </div>
  );
};
