import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ErrorOverlay } from "../../common/ErrorOverlay";
import { LoadingOverlay } from "../../common/LoadingOverlay";
import { OpenInCodeSandboxButton } from "../../common/OpenInCodeSandboxButton";
import { SandpackStack } from "../../common/Stack";
import { useSandpack } from "../../hooks/useSandpack";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { generateRandomId } from "../../utils/stringUtils";
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
  style?: React.CSSProperties;
  viewportSize?: ViewportSize;
  viewportOrientation?: ViewportOrientation;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
}

export { RefreshButton };

const previewClassName = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "white",
  overflow: "auto",
  position: "relative",
});

const previewIframe = css({
  border: "0",
  outline: "0",
  width: "100%",
  height: "100%",
  minHeight: "160px",
  maxHeight: "2000px",
  flex: 1,
});

const previewActionsClassName = css({
  display: "flex",
  position: "absolute",
  bottom: "$space$2",
  right: "$space$2",
  zIndex: "$overlay",

  "> *": { marginLeft: "$space$2" },
});

/**
 * @category Components
 */
export const SandpackPreview = ({
  style,
  showNavigator = false,
  showRefreshButton = true,
  showOpenInCodeSandbox = true,
  showSandpackErrorOverlay = true,
  viewportSize = "auto",
  viewportOrientation = "portrait",
}: PreviewProps): JSX.Element => {
  const { sandpack, listen } = useSandpack();
  const [iframeComputedHeight, setComputedAutoHeight] = React.useState<
    number | null
  >(null);
  const {
    status,
    registerBundler,
    unregisterBundler,
    errorScreenRegisteredRef,
    openInCSBRegisteredRef,
    loadingScreenRegisteredRef,
  } = sandpack;

  const c = useClasser(THEME_PREFIX);
  const clientId = React.useRef<string>(generateRandomId());
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  // SandpackPreview immediately registers the custom screens/components so the bundler does not render any of them
  openInCSBRegisteredRef.current = true;
  errorScreenRegisteredRef.current = true;
  loadingScreenRegisteredRef.current = true;

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const iframeElement = iframeRef.current!;
    const clientIdValue = clientId.current;

    registerBundler(iframeElement, clientIdValue);

    const unsubscribe = listen((message) => {
      if (message.type === "resize") {
        setComputedAutoHeight(message.height);
      }
    }, clientIdValue);

    return (): void => {
      unsubscribe();
      unregisterBundler(clientIdValue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewURL = (newUrl: string): void => {
    if (!iframeRef.current) {
      return;
    }

    iframeRef.current.src = newUrl;
  };

  const viewportStyle = computeViewportSize(viewportSize, viewportOrientation);

  return (
    <SandpackStack
      style={{
        ...style,
        ...viewportStyle,
      }}
    >
      {showNavigator ? (
        <Navigator clientId={clientId.current} onURLChange={handleNewURL} />
      ) : null}

      <div className={classNames(c("preview-container"), previewClassName)}>
        <iframe
          ref={iframeRef}
          className={classNames(c("preview-iframe"), previewIframe)}
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

        <div
          className={classNames(c("preview-actions"), previewActionsClassName)}
        >
          {!showNavigator && showRefreshButton && status === "running" ? (
            <RefreshButton clientId={clientId.current} />
          ) : null}

          {showOpenInCodeSandbox ? <OpenInCodeSandboxButton /> : null}
        </div>

        <LoadingOverlay clientId={clientId.current} />
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
