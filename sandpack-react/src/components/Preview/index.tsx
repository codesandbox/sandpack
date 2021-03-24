import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { OpenInCodeSandboxButton } from "../../common/OpenInCodeSandboxButton";
import { SandpackStack } from "../../common/Stack";
import { useSandpack } from "../../hooks/useSandpack";
import { Navigator } from "../Navigator";

import { RefreshButton } from "./RefreshButton";

export interface PreviewProps {
  customStyle?: React.CSSProperties;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
}

export { RefreshButton };

export const SandpackPreview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator = false,
  showRefreshButton = true,
  showOpenInCodeSandbox = true,
  showSandpackErrorOverlay = true,
}) => {
  const { sandpack, listen } = useSandpack();

  const { status, iframeRef, errorScreenRegisteredRef } = sandpack;

  const c = useClasser("sp");

  React.useEffect(() => {
    errorScreenRegisteredRef.current = true;

    const unsub = listen((message) => {
      if (message.type === "resize" && iframeRef.current) {
        iframeRef.current.style.height = `${message.height}px`;
      }
    });

    return () => unsub();
  }, []);

  return (
    <SandpackStack
      customStyle={{
        ...customStyle,
        display: status !== "idle" ? "flex" : "none",
      }}
    >
      {showNavigator && <Navigator />}

      <div className={c("preview-container")}>
        <iframe
          ref={iframeRef}
          className={c("preview-iframe")}
          title="Sandpack Preview"
        />
        {showSandpackErrorOverlay && <ErrorOverlay />}

        <div className={c("preview-actions")}>
          {!showNavigator && showRefreshButton && status === "running" && (
            <RefreshButton />
          )}

          {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
        </div>

        <LoadingOverlay />
      </div>
    </SandpackStack>
  );
};
