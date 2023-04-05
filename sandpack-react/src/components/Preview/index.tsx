import { useClasser } from "@code-hike/classer";
import type {
  SandpackClient,
  SandpackMessage,
} from "@codesandbox/sandpack-client";
import * as React from "react";

import {
  useSandpackClient,
  useSandpackNavigation,
  useSandpackShell,
} from "../../hooks";
import { css, THEME_PREFIX } from "../../styles";
import { classNames } from "../../utils/classNames";
import { Navigator } from "../Navigator";
import { ErrorOverlay } from "../common/ErrorOverlay";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { OpenInCodeSandboxButton } from "../common/OpenInCodeSandboxButton";
import { RoundedButton } from "../common/RoundedButton";
import { SandpackStack } from "../common/Stack";
import { RefreshIcon, RestartIcon } from "../icons";

export interface PreviewProps {
  style?: React.CSSProperties;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showRestartButton?: boolean;

  /**
   * Whether to show the `<ErrorOverlay>` component on top of
   * the preview, if a runtime error happens.
   */
  showSandpackErrorOverlay?: boolean;
  showOpenNewtab?: boolean;
  actionsChildren?: JSX.Element;
  children?: JSX.Element;
  startRoute?: string;
}

const previewClassName = css({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "white",
  overflow: "auto",
  position: "relative",

  [`.${THEME_PREFIX}-bridge-frame`]: {
    border: 0,
    position: "absolute",
    left: "$space$2",
    bottom: "$space$2",
    zIndex: "$top",
    height: 12,
    width: "30%",
    mixBlendMode: "multiply",
    pointerEvents: "none",
  },
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
  gap: "$space$2",
});

export interface SandpackPreviewRef {
  /**
   * Retrieve the current Sandpack client instance from preview
   */
  getClient: () => InstanceType<typeof SandpackClient> | null;
  /**
   * Returns the client id, which will be used to
   * initialize a client in the main Sandpack context
   */
  clientId: string;
}

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
      showOpenNewtab = true,
      showRestartButton = true,
      actionsChildren = <></>,
      children,
      className,
      startRoute = "/",
      ...props
    },
    ref
  ) => {
    const { sandpack, listen, iframe, getClient, clientId } = useSandpackClient(
      { startRoute }
    );
    const [iframeComputedHeight, setComputedAutoHeight] = React.useState<
      number | null
    >(null);
    const { status, errorScreenRegisteredRef, loadingScreenRegisteredRef } =
      sandpack;
    const { refresh } = useSandpackNavigation(clientId);
    const { restart } = useSandpackShell(clientId);

    const c = useClasser(THEME_PREFIX);

    errorScreenRegisteredRef.current = true;
    loadingScreenRegisteredRef.current = true;

    React.useEffect(() => {
      const unsubscribe = listen((message: SandpackMessage) => {
        if (message.type === "resize") {
          setComputedAutoHeight(message.height);
        }
      });

      return unsubscribe;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        clientId: clientId,
        getClient,
      }),
      [getClient, clientId]
    );

    const handleNewURL = (newUrl: string): void => {
      if (!iframe.current) {
        return;
      }

      iframe.current.src = newUrl;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
      <SandpackStack
        className={classNames(`${THEME_PREFIX}-preview`, className)}
        {...props}
      >
        {showNavigator && (
          <Navigator
            clientId={clientId}
            onURLChange={handleNewURL}
            startRoute={startRoute}
          />
        )}

        <div className={classNames(c("preview-container"), previewClassName)}>
          <iframe
            ref={iframe}
            className={classNames(c("preview-iframe"), previewIframe)}
            style={{
              // set height based on the content only in auto mode
              // and when the computed height was returned by the bundler
              height: iframeComputedHeight ? iframeComputedHeight : undefined,
            }}
            title="Sandpack Preview"
          />

          <div
            className={classNames(
              c("preview-actions"),
              previewActionsClassName
            )}
          >
            {actionsChildren}

            {showRestartButton && sandpack.environment === "node" && (
              <RoundedButton onClick={restart}>
                <RestartIcon />
              </RoundedButton>
            )}

            {!showNavigator && showRefreshButton && status === "running" && (
              <RoundedButton onClick={refresh}>
                <RefreshIcon />
              </RoundedButton>
            )}

            {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
          </div>

          <LoadingOverlay
            clientId={clientId}
            showOpenInCodeSandbox={showOpenInCodeSandbox}
          />

          {showSandpackErrorOverlay && <ErrorOverlay />}

          {children}
        </div>
      </SandpackStack>
    );
  }
);
