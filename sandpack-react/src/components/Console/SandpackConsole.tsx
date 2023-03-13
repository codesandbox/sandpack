import * as React from "react";

import { useSandpack, useSandpackShell } from "../../hooks";
import { useSandpackShellStdout } from "../../hooks/useSandpackShellStdout";
import { css, THEME_PREFIX } from "../../styles";
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
      ...props
    },
    ref
  ) => {
    const {
      sandpack: { environment },
    } = useSandpack();

    const { restart } = useSandpackShell();

    const [currentTab, setCurrentTab] = React.useState<"server" | "client">(
      environment === "node" ? "server" : "client"
    );

    const { logs: consoleData, reset: resetConsole } = useSandpackConsole({
      maxMessageCount,
      showSyntaxError,
      resetOnPreviewRestart,
    });

    const { logs: stdoutData, reset: resetStdout } = useSandpackShellStdout({
      maxMessageCount,
      resetOnPreviewRestart,
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
      </SandpackStack>
    );
  }
);
