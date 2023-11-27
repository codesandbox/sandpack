import * as React from "react";

import {
  useSandpack,
  useSandpackClient,
  useSandpackShell,
  useSandpackShellStdout,
} from "../../hooks";
import { css, THEME_PREFIX } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { SandpackStack, DependenciesProgress, RoundedButton } from "../common";
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
  showRestartButton?: boolean;
  showResetConsoleButton?: boolean;
  maxMessageCount?: number;
  onLogsChange?: (logs: SandpackConsoleData) => void;
  resetOnPreviewRestart?: boolean;
  standalone?: boolean;
  actionsChildren?: JSX.Element;
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
      showResetConsoleButton = true,
      showRestartButton = true,
      resetOnPreviewRestart = false,
      actionsChildren = <></>,
      standalone = false,
      ...props
    },
    ref
  ) => {
    const {
      sandpack: { environment },
    } = useSandpack();

    const { iframe, clientId: internalClientId } = useSandpackClient();

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

    const classNames = useClassNames();

    return (
      <SandpackStack
        className={classNames("console", [
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
          className,
        ])}
        {...props}
      >
        {showHeader && isNodeEnvironment && (
          <Header
            currentTab={currentTab}
            node={isNodeEnvironment}
            setCurrentTab={setCurrentTab}
          />
        )}

        <div
          ref={wrapperRef}
          className={classNames("console-list", [
            css({ overflow: "auto", scrollBehavior: "smooth" }),
          ])}
        >
          {isServerTab ? (
            <StdoutList data={stdoutData} />
          ) : (
            <ConsoleList data={consoleData} />
          )}
        </div>

        <div
          className={classNames("console-actions", [
            css({
              position: "absolute",
              bottom: "$space$2",
              right: "$space$2",
              display: "flex",
              gap: "$space$2",
            }),
          ])}
        >
          {actionsChildren}

          {showRestartButton && isServerTab && (
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

          {showResetConsoleButton && (
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
          )}
        </div>

        {standalone && (
          <>
            <DependenciesProgress clientId={clientId} />
            <iframe ref={iframe} />
          </>
        )}
      </SandpackStack>
    );
  }
);
