import * as React from "react";

import {
  useSandpack,
  useSandpackClient,
  useSandpackShell,
  useSandpackPreviewProgress,
  useSandpackShellStdout,
} from "../../hooks";
import { css, THEME_PREFIX } from "../../styles";
import { fadeIn } from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { SandpackStack } from "../common";
import { RoundedButton } from "../common/RoundedButton";
import { CleanIcon, RestartIcon } from "../icons";

import { ConsoleList } from "./ConsoleList";
import { Header } from "./Header";
import { StdoutList } from "./StdoutList";
import { useSandpackConsole } from "./useSandpackConsole";
import type { SandpackConsoleData } from "./utils/getType";

interface SandpackConsoleProps {
  clientId?: string;
  showHeader?: boolean;
  showSyntaxError?: boolean;
  showSetupProgress?: boolean;
  maxMessageCount?: number;
  onLogsChange?: (logs: SandpackConsoleData) => void;
  resetOnPreviewRestart?: boolean;
  standalone?: boolean;
}

export interface SandpackConsoleRef {
  reset: () => void;
}

/**
 * `SandpackConsole` is a Sandpack devtool that allows printing
 * the console logs from a Sandpack client. It is designed to be
 * a light version of a browser console, which means that it's
 * limited to a set of common use cases you may encounter when coding.
 */
export const SandpackConsole = React.forwardRef<
  SandpackConsoleRef,
  React.HTMLAttributes<HTMLDivElement> & SandpackConsoleProps
>(
  (
    {
      showHeader = true,
      showSyntaxError = false,
      maxMessageCount,
      onLogsChange,
      className,
      showSetupProgress = false,
      resetOnPreviewRestart = false,
      standalone,
      ...props
    },
    ref
  ) => {
    const {
      sandpack: { environment },
    } = useSandpack();

    const { iframe, clientId: internalClientId } = useSandpackClient();
    const progressMessage = useSandpackPreviewProgress(3_000);

    const { restart } = useSandpackShell();

    const [currentTab, setCurrentTab] = React.useState<"server" | "client">(
      environment === "node" ? "server" : "client"
    );

    const clientId = standalone ? internalClientId : undefined;

    const { logs: consoleData, reset: resetConsole } = useSandpackConsole({
      maxMessageCount,
      showSyntaxError,
      resetOnPreviewRestart,
      clientId,
    });

    const { logs: stdoutData, reset: resetStdout } = useSandpackShellStdout({
      maxMessageCount,
      resetOnPreviewRestart,
      clientId,
    });

    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      onLogsChange?.(consoleData);

      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
      }
    }, [onLogsChange, consoleData, stdoutData, currentTab]);

    const isServerTab = currentTab === "server";
    const isNodeEnvironment = environment === "node";

    React.useImperativeHandle(ref, () => ({
      reset() {
        resetConsole();
        resetStdout();
      },
    }));

    return (
      <SandpackStack
        className={classNames(
          css({
            height: "100%",
            background: "$surface1",
            iframe: { display: "none" },

            [`.${THEME_PREFIX}-bridge-frame`]: {
              display: "block",
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
          }),
          `${THEME_PREFIX}-console`,
          className
        )}
        {...props}
      >
        {(showHeader || isNodeEnvironment) && (
          <Header
            currentTab={currentTab}
            node={isNodeEnvironment}
            setCurrentTab={setCurrentTab}
          />
        )}

        <div
          ref={wrapperRef}
          className={classNames(
            css({ overflow: "auto", scrollBehavior: "smooth" })
          )}
        >
          {isServerTab ? (
            <StdoutList data={stdoutData} />
          ) : (
            <ConsoleList data={consoleData} />
          )}
        </div>

        <div
          className={classNames(
            css({
              position: "absolute",
              bottom: "$space$2",
              right: "$space$2",
              display: "flex",
              gap: "$space$2",
            })
          )}
        >
          {isServerTab && (
            <RoundedButton
              onClick={(): void => {
                restart();
                resetConsole();
                resetStdout();
              }}
            >
              <RestartIcon />
            </RoundedButton>
          )}

          <RoundedButton
            onClick={(): void => {
              if (currentTab === "client") {
                resetConsole();
              } else {
                resetStdout();
              }
            }}
          >
            <CleanIcon />
          </RoundedButton>
        </div>

        {progressMessage && (
          <div className={progressClassName.toString()}>
            <p>{progressMessage}</p>
          </div>
        )}

        <iframe ref={iframe} />
      </SandpackStack>
    );
  }
);

const progressClassName = css({
  position: "absolute",
  left: "$space$5",
  bottom: "$space$4",
  zIndex: "$top",
  color: "$colors$clickable",
  animation: `${fadeIn} 150ms ease`,
  fontFamily: "$font$mono",
  fontSize: ".8em",
  width: "75%",
  p: {
    whiteSpace: "nowrap",
    margin: 0,
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
});
