import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { stackClassName } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { useTranspiledCode } from "../../hooks/useTranspiledCode";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import type { CodeViewerProps } from "../CodeViewer";
import { SandpackCodeViewer } from "../CodeViewer";
import { ErrorOverlay } from "../common/ErrorOverlay";
import { LoadingOverlay } from "../common/LoadingOverlay";

const transpiledCodeClassName = css({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  position: "relative",
  overflow: "auto",
  minHeight: "160px",
  flex: 1,
});

/**
 * @category Components
 */
export const SandpackTranspiledCode = ({
  className,
  ...props
}: CodeViewerProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const { sandpack } = useSandpack();
  const transpiledCode = useTranspiledCode();
  const c = useClasser(THEME_PREFIX);

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
    <div
      className={classNames(
        c("transpiled-code"),
        stackClassName,
        transpiledCodeClassName,
        className
      )}
      {...props}
    >
      <SandpackCodeViewer
        code={transpiledCode ?? ""}
        initMode={sandpack.initMode}
        {...props}
      />

      <iframe
        ref={hiddenIframeRef}
        style={{ display: "none" }}
        title="transpiled sandpack code"
      />
      <ErrorOverlay />
      <LoadingOverlay clientId="hidden" showOpenInCodeSandbox={false} />
    </div>
  );
};
