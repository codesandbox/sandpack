import { useClasser } from "@code-hike/classer";
import type {
  SandpackClient,
  SandpackMessage,
} from "@codesandbox/sandpack-client";
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

/**
 * @category Components
 */
export interface PreviewProps {
  style?: React.CSSProperties;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
  actionsChildren?: JSX.Element;
  children?: JSX.Element;
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
export interface SandpackPreviewRef {
  /**
   * Retrieve the current Sandpack client instance from preview
   */
  getClient: () => SandpackClient | undefined;
  /**
   * Returns the client id, which will be used to
   * initialize a client in the main Sandpack context
   */
  clientId: string;
}

/**
 * @category Components
 */
export const SandpackPreview = React.forwardRef<
  SandpackPreviewRef,
  PreviewProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      showNavigator = false,
      showRefreshButton = true,
      showOpenInCodeSandbox = true,
      showSandpackErrorOverlay = true,
      actionsChildren = <></>,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
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

      const unsubscribe = listen((message: SandpackMessage) => {
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

    React.useImperativeHandle(
      ref,
      () => ({
        clientId: clientId.current,
        getClient(): SandpackClient | undefined {
          return sandpack.clients[clientId.current];
        },
      }),
      [sandpack]
    );

    const handleNewURL = (newUrl: string): void => {
      if (!iframeRef.current) {
        return;
      }

      iframeRef.current.src = newUrl;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
      <SandpackStack
        className={className}
        style={{
          ...style,
        }}
        {...props}
      >
        {showNavigator && (
          <Navigator clientId={clientId.current} onURLChange={handleNewURL} />
        )}

        <div className={classNames(c("preview-container"), previewClassName)}>
          <iframe
            ref={iframeRef}
            className={classNames(c("preview-iframe"), previewIframe)}
            style={{
              // set height based on the content only in auto mode
              // and when the computed height was returned by the bundler
              height: iframeComputedHeight ? iframeComputedHeight : undefined,
            }}
            title="Sandpack Preview"
          />

          {showSandpackErrorOverlay && <ErrorOverlay />}

          <div
            className={classNames(
              c("preview-actions"),
              previewActionsClassName
            )}
          >
            {actionsChildren}
            {!showNavigator && showRefreshButton && status === "running" && (
              <RefreshButton clientId={clientId.current} />
            )}

            {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
          </div>

          <LoadingOverlay
            clientId={clientId.current}
            showOpenInCodeSandbox={showOpenInCodeSandbox}
          />

          {children}
        </div>
      </SandpackStack>
    );
  }
);
