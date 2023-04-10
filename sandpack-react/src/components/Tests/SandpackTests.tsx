import * as React from "react";

import { useSandpackTheme, useSandpackClient } from "../../hooks";
import { css } from "../../styles";
import { useClassNames } from "../../utils/classNames";
import { SandpackStack } from "../common";
import { Loading } from "../common/Loading";

import { Header } from "./Header";
import { RunButton } from "./RunButton";
import type { Spec } from "./Specs";
import { Specs } from "./Specs";
import { Summary } from "./Summary";
import type { Test } from "./Tests";
import { failTextClassName, setTestTheme } from "./style";
import {
  flatMap,
  getDuration,
  getAllTestResults,
  getAllSuiteResults,
  splitTail,
  set,
} from "./utils";

const previewActionsClassName = css({
  display: "flex",
  position: "absolute",
  bottom: "$space$2",
  right: "$space$2",
  zIndex: "$overlay",

  "> *": { marginLeft: "$space$2" },
});

export type Status = "initialising" | "idle" | "running" | "complete";

interface State {
  specs: Record<string, Spec>;
  status: Status;
  verbose: boolean;
  watchMode: boolean;
  suiteOnly: boolean;
  specsCount: number;
}

const INITIAL_STATE: State = {
  specs: {},
  status: "initialising",
  verbose: false,
  watchMode: true,
  suiteOnly: false,
  specsCount: 0,
};

export const SandpackTests: React.FC<
  {
    verbose?: boolean;
    watchMode?: boolean;
    onComplete?: (specs: Record<string, Spec>) => void;
    actionsChildren?: JSX.Element;
    showVerboseButton?: boolean;
    showWatchButton?: boolean;
    /**
     * Hide the tests and supress logs
     * If `true` the tests will be hidden and the logs will be supressed. This is useful when you want to run tests in the background and don't want to show the tests to the user.
     * @default false
     */
    hideTestsAndSupressLogs?: boolean;
  } & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({
  verbose = false,
  watchMode = true,
  style,
  className,
  onComplete,
  actionsChildren,
  showVerboseButton = true,
  showWatchButton = true,
  hideTestsAndSupressLogs = false,
  ...props
}) => {
  const theme = useSandpackTheme();
  const { getClient, iframe, listen, sandpack } = useSandpackClient();

  const [state, setState] = React.useState<State>({
    ...INITIAL_STATE,
    verbose,
    watchMode,
  });

  const runAllTests = React.useCallback((): void => {
    setState((oldState) => ({
      ...oldState,
      status: "running",
      specs: {},
    }));

    const client = getClient();
    if (client) {
      client.dispatch({ type: "run-all-tests" });
    }
  }, [getClient]);

  const runSpec = React.useCallback((): void => {
    setState((oldState) => ({
      ...oldState,
      status: "running",
      specs: {},
    }));

    const client = getClient();
    if (client) {
      client.dispatch({ type: "run-tests", path: sandpack.activeFile });
    }
  }, [getClient, sandpack.activeFile]);

  const testFileRegex = /.*\.(test|spec)\.[tj]sx?$/;
  const isSpecOpen = sandpack.activeFile.match(testFileRegex) !== null;

  React.useEffect(() => {
    let currentDescribeBlocks: string[] = [];
    let currentSpec = "";

    const unsubscribe = listen((data): void => {
      // Note: short-circuit if message isn't for the currently active spec when `suiteOnly` is true
      if (
        state.suiteOnly &&
        (("path" in data && data.path !== sandpack.activeFile) ||
          ("test" in data &&
            "path" in data.test &&
            data.test.path !== sandpack.activeFile))
      ) {
        return;
      }

      if (
        data.type === "action" &&
        data.action === "clear-errors" &&
        data.source === "jest"
      ) {
        currentSpec = data.path;
        return;
      }

      if (data.type === "test") {
        if (data.event === "initialize_tests") {
          currentDescribeBlocks = [];
          currentSpec = "";
          if (state.watchMode) {
            return runAllTests();
          } else {
            return setState((oldState) => ({
              ...oldState,
              status: "idle",
              specs: {},
            }));
          }
        }

        if (data.event === "test_count") {
          return setState((oldState) => ({
            ...oldState,
            specsCount: data.count,
          }));
        }

        if (data.event === "total_test_start") {
          currentDescribeBlocks = [];
          return setState((oldState) => ({ ...oldState, status: "running" }));
        }

        if (data.event === "total_test_end") {
          return setState((oldState) => {
            if (onComplete !== undefined) {
              onComplete(oldState.specs);
            }
            return {
              ...oldState,
              status: "complete",
            };
          });
        }

        if (data.event === "add_file") {
          return setState(
            set(["specs", data.path], {
              describes: {},
              tests: {},
              name: data.path,
            })
          );
        }

        if (data.event === "remove_file") {
          return setState((oldState) => {
            const specs = Object.entries(oldState.specs).reduce(
              (acc, [key, value]) => {
                if (key === data.path) {
                  return acc;
                } else {
                  return { ...acc, [key]: value };
                }
              },
              {}
            );

            return { ...oldState, specs };
          });
        }

        if (data.event === "file_error") {
          return setState(set(["specs", data.path, "error"], data.error));
        }

        if (data.event === "describe_start") {
          currentDescribeBlocks.push(data.blockName);
          const [describePath, currentDescribe] = splitTail(
            currentDescribeBlocks
          );
          const spec = currentSpec;

          if (currentDescribe === undefined) {
            return;
          }

          return setState(
            set(
              [
                "specs",
                spec,
                "describes",
                ...flatMap(describePath, (name) => [name, "describes"]),
                currentDescribe,
              ],
              {
                name: data.blockName,
                tests: {},
                describes: {},
              }
            )
          );
        }

        if (data.event === "describe_end") {
          currentDescribeBlocks.pop();
          return;
        }

        if (data.event === "add_test") {
          const [describePath, currentDescribe] = splitTail(
            currentDescribeBlocks
          );
          const test: Test = {
            status: "idle",
            errors: [],
            name: data.testName,
            blocks: [...currentDescribeBlocks],
            path: data.path,
          };
          if (currentDescribe === undefined) {
            return setState(
              set(["specs", data.path, "tests", data.testName], test)
            );
          } else {
            return setState(
              set(
                [
                  "specs",
                  data.path,
                  "describes",
                  ...flatMap(describePath, (name) => [name, "describes"]),
                  currentDescribe,
                  "tests",
                  data.testName,
                ],
                test
              )
            );
          }
        }

        if (data.event === "test_start") {
          const { test } = data;
          const [describePath, currentDescribe] = splitTail(test.blocks);

          const startedTest: Test = {
            status: "running",
            name: test.name,
            blocks: test.blocks,
            path: test.path,
            errors: [],
          };

          if (currentDescribe === undefined) {
            return setState(
              set(["specs", test.path, "tests", test.name], startedTest)
            );
          } else {
            return setState(
              set(
                [
                  "specs",
                  test.path,
                  "describes",
                  ...flatMap(describePath, (name) => [name, "describes"]),
                  currentDescribe,
                  "tests",
                  test.name,
                ],
                startedTest
              )
            );
          }
        }

        if (data.event === "test_end") {
          const { test } = data;
          const [describePath, currentDescribe] = splitTail(test.blocks);
          const endedTest = {
            status: test.status,
            errors: test.errors,
            duration: test.duration,
            name: test.name,
            blocks: test.blocks,
            path: test.path,
          };

          if (currentDescribe === undefined) {
            return setState(
              set(["specs", test.path, "tests", test.name], endedTest)
            );
          } else {
            return setState(
              set(
                [
                  "specs",
                  test.path,
                  "describes",
                  ...flatMap(describePath, (name) => [name, "describes"]),
                  currentDescribe,
                  "tests",
                  test.name,
                ],
                endedTest
              )
            );
          }
        }
      }
    });

    return unsubscribe;
  }, [state.suiteOnly, state.watchMode, sandpack.activeFile]);

  React.useEffect(
    function watchMode() {
      const unsunscribe = listen(({ type }) => {
        if (type === "done" && state.watchMode) {
          if (isSpecOpen) {
            runSpec();
          } else {
            runAllTests();
          }
        }
      });

      return unsunscribe;
    },
    [runSpec, runAllTests, state.watchMode, isSpecOpen]
  );

  const openSpec = (file: string): void => {
    sandpack.setActiveFile(file);
  };

  const specs = Object.values(state.specs);
  const duration = getDuration(specs);
  const testResults = getAllTestResults(specs);
  const suiteResults = getAllSuiteResults(specs);

  const classNames = useClassNames();

  return (
    <SandpackStack
      className={classNames(`tests`, [className])}
      style={{
        ...setTestTheme(theme.themeMode === "dark"),
        ...style,
      }}
      {...props}
    >
      <iframe ref={iframe} style={{ display: "none" }} title="Sandpack Tests" />

      <Header
        hideTestsAndSupressLogs={hideTestsAndSupressLogs}
        setSuiteOnly={(): void =>
          setState((s) => ({ ...s, suiteOnly: !s.suiteOnly }))
        }
        setVerbose={(): void =>
          setState((s) => ({ ...s, verbose: !s.verbose }))
        }
        setWatchMode={(): void => {
          setState((s) => ({ ...s, watchMode: !s.watchMode }));
        }}
        showSuitesOnly={state.specsCount > 1}
        showVerboseButton={showVerboseButton}
        showWatchButton={showWatchButton}
        status={state.status}
        suiteOnly={state.suiteOnly}
        verbose={state.verbose}
        watchMode={state.watchMode}
      />

      {state.status === "running" || state.status === "initialising" ? (
        <Loading showOpenInCodeSandbox={false} />
      ) : (
        <div className={previewActionsClassName.toString()}>
          {actionsChildren}
          <RunButton onClick={state.suiteOnly ? runSpec : runAllTests} />
        </div>
      )}

      <div className={containerClassName.toString()}>
        {specs.length === 0 && state.status === "complete" ? (
          <div className={fileErrorContainerClassName.toString()}>
            <p>No test files found.</p>
            <p>
              Test match:{" "}
              <span className={failTextClassName.toString()}>
                {testFileRegex.toString()}
              </span>
            </p>
          </div>
        ) : (
          <>
            <Specs
              hideTestsAndSupressLogs={hideTestsAndSupressLogs}
              openSpec={openSpec}
              specs={specs}
              status={state.status}
              verbose={state.verbose}
            />

            {state.status === "complete" && testResults.total > 0 && (
              <Summary
                duration={duration}
                suites={suiteResults}
                tests={testResults}
              />
            )}
          </>
        )}
      </div>
    </SandpackStack>
  );
};

const containerClassName = css({
  padding: "$space$4",
  height: "100%",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  fontFamily: "$font$mono",
});

const fileErrorContainerClassName = css({
  fontWeight: "bold",
  color: "$colors$base",
});
