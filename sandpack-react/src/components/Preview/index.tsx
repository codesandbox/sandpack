import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { OpenInCodeSandboxButton } from "../../common/OpenInCodeSandboxButton";
import { SandpackStack } from "../../common/Stack";
import { useSandpack } from "../../hooks/useSandpack";
import { Navigator } from "../Navigator";

import { RefreshButton } from "./RefreshButton";

export type ViewportSizePreset =
  | "iPhone X"
  | "Pixel 2"
  | "iPad"
  | "Moto G4"
  | "Surface Duo";

export type ViewportSize =
  | ViewportSizePreset
  | "auto"
  | { width: number; height: number };

export type ViewportOrientation = "portrait" | "landscape";
export interface PreviewProps {
  customStyle?: React.CSSProperties;
  viewportSize?: ViewportSize;
  viewportOrientation?: ViewportOrientation;
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
  viewportSize = "auto",
  viewportOrientation = "portrait",
}) => {
  const { sandpack, listen } = useSandpack();
  const [iframeComputedHeight, setComputedAutoHeight] = React.useState<
    number | null
  >(null);
  const {
    status,
    iframeRef,
    errorScreenRegisteredRef,
    openInCSBRegisteredRef,
  } = sandpack;

  const c = useClasser("sp");

  React.useEffect(() => {
    errorScreenRegisteredRef.current = true;
    openInCSBRegisteredRef.current = true;

    const unsub = listen((message) => {
      if (message.type === "resize" && iframeRef.current) {
        setComputedAutoHeight(message.height);
      }
    });

    return () => unsub();
  }, []);

  const viewportStyle = computeViewportSize(viewportSize, viewportOrientation);

  return (
    <SandpackStack
      customStyle={{
        ...customStyle,
        ...viewportStyle,
        display: status !== "idle" ? "flex" : "none",
      }}
    >
      {showNavigator ? <Navigator /> : null}

      <div className={c("preview-container")}>
        <iframe
          ref={iframeRef}
          className={c("preview-iframe")}
          style={{
            // set height based on the content only in auto mode
            // and when the computed height was returned by the bundler
            height:
              viewportSize === "auto" && iframeComputedHeight
                ? iframeComputedHeight
                : undefined,
          }}
          title="Sandpack Preview"
        />

        {showSandpackErrorOverlay ? <ErrorOverlay /> : null}

        <div className={c("preview-actions")}>
          {!showNavigator && showRefreshButton && status === "running" ? (
            <RefreshButton />
          ) : null}

          {showOpenInCodeSandbox ? <OpenInCodeSandboxButton /> : null}
        </div>

        <LoadingOverlay />
      </div>
    </SandpackStack>
  );
};

const VIEWPORT_SIZE_PRESET_MAP: Record<
  ViewportSizePreset,
  { x: number; y: number }
> = {
  "iPhone X": { x: 375, y: 812 },
  iPad: { x: 768, y: 1024 },
  "Pixel 2": { x: 411, y: 731 },
  "Moto G4": { x: 360, y: 640 },
  "Surface Duo": { x: 540, y: 720 },
};

const computeViewportSize = (
  viewport: ViewportSize,
  orientation: ViewportOrientation
): { width?: number; height?: number } => {
  if (viewport === "auto") {
    return {};
  }

  if (typeof viewport === "string") {
    const { x, y } = VIEWPORT_SIZE_PRESET_MAP[viewport];
    return orientation === "portrait"
      ? { width: x, height: y }
      : { width: y, height: x };
  }

  return viewport;
};
