import * as React from "react";

import { usePreview } from "../../hooks/usePreview";
import { css, THEME_PREFIX } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { Navigator } from "../Navigator";
import { ErrorOverlay } from "../common/ErrorOverlay";
import { LoadingOverlay } from "../common/LoadingOverlay";
import { OpenInCodeSandboxButton } from "../common/OpenInCodeSandboxButton";
import { RoundedButton } from "../common/RoundedButton";
import { SandpackStack } from "../common/Stack";
import { RefreshIcon } from "../icons";

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

export const SandpackPreview = ({
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
}: PreviewProps & React.HTMLAttributes<HTMLDivElement>) => {
  const preview = usePreview();
  const iframeContainerRef = React.useRef<HTMLDivElement>(null);

  // TODO: Question why we need to compute this height. It comes from a subscription to "resize",
  // which comes from an injected script in the iframe, but only on NodeBox?
  const [iframeComputedHeight] = React.useState<number | null>(null);
  const classNames = useClassNames();

  React.useLayoutEffect(() => {
    if (iframeContainerRef.current) {
      preview.iframe.className = classNames("preview-iframe", [previewIframe]);
      preview.iframe.title = "Sandpack Preview";
      iframeContainerRef.current.prepend(preview.iframe);
    }
  }, []);

  React.useLayoutEffect(() => {
    if (iframeComputedHeight) {
      preview.iframe.style.height = iframeComputedHeight + "px";
    }
  }, [iframeComputedHeight, preview]);

  /*
  const { sandpack, listen, iframe, getClient, clientId, dispatch } =
    useSandpackClient({ startRoute });
    */

  // const { refresh } = useSandpackNavigation(clientId);
  // const { restart } = useSandpackShell(clientId);

  const handleNewURL = (newUrl: string): void => {
    preview.iframe.src = newUrl;
  };

  return (
    <SandpackStack className={classNames("preview", [className])} {...props}>
      {showNavigator && (
        <Navigator
          onURLChange={handleNewURL}
          preview={preview}
          startRoute={startRoute}
        />
      )}

      <div
        ref={iframeContainerRef}
        className={classNames("preview-container", [previewClassName])}
      >
        <div
          className={classNames("preview-actions", [previewActionsClassName])}
        >
          {actionsChildren}

          {/*
          TODO: showRestartButton is never passed, why is this here?
          showRestartButton && sandpack.environment === "node" && (
            <RoundedButton onClick={restart}>
              <RestartIcon />
            </RoundedButton>
          )*/}

          {!showNavigator &&
            showRefreshButton &&
            preview.status.current === "READY" && (
              <RoundedButton onClick={() => preview.refresh()}>
                <RefreshIcon />
              </RoundedButton>
            )}

          {/*
          TODO: What is teamId used for? How can you sign out of Sandpack?
          sandpack.teamId && (
            <button
              className={classNames("button", [
                classNames("icon-standalone"),
                buttonClassName,
                iconStandaloneClassName,
                roundedButtonClassName,
              ])}
              onClick={() => dispatch({ type: "sign-out" })}
              title="Sign out"
              type="button"
            >
              <SignOutIcon />
            </button>
          )*/}

          {/*showOpenInCodeSandbox && <OpenInCodeSandboxButton />*/}
        </div>

        <LoadingOverlay
          preview={preview}
          showOpenInCodeSandbox={showOpenInCodeSandbox}
        />

        {/*showSandpackErrorOverlay && (
          <ErrorOverlay description="No idea" title="Preview" />
        )*/}

        {children}
      </div>
    </SandpackStack>
  );
};
