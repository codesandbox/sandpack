import immer from "immer";
import set from "lodash/set";
import * as React from "react";

import { SandpackStack } from "../../common";
import { Loading } from "../../common/Loading";
import { useSandpackTheme } from "../../hooks";
import { css } from "../../styles";
import { classNames } from "../../utils/classNames";
import { isDarkColor } from "../../utils/stringUtils";

import { Controls } from "./Controls";
import type { Spec } from "./Specs";
import { Specs } from "./Specs";
import { Summary } from "./Summary";
import type { Test } from "./Tests";
import { failTextClassName, setTestTheme } from "./style";
import { useSandpackClient } from "./useSandpackClient";
import {
  flatMap,
  getDuration,
  getAllTestResults,
  getAllSuiteResults,
  splitTail,
} from "./utils";

export type Status = "initialising" | "idle" | "running" | "complete";
type RunMode = "all" | "single";

interface State {
  specs: Record<string, Spec>;
  status: Status;
  runMode: RunMode;
  verbose: boolean;
  watchMode: boolean;
}

const INITIAL_STATE: State = {
  specs: {},
  status: "initialising",
  runMode: "all",
  verbose: false,
  watchMode: true,
};

export const SandpackTests: React.FC<
  {
    verbose?: boolean;
    watchMode?: boolean;
  } & React.HtmlHTMLAttributes<HTMLDivElement>
> = ({ verbose = false, watchMode = true, style, ...props }) => {
  const theme = useSandpackTheme();
  const { getClient, iframe, listen, sandpack } = useSandpackClient();

  const [state, setState] = React.useState<State>({
    ...INITIAL_STATE,
    verbose,
    watchMode,
  });

  React.useEffect(() => {
    let currentDescribeBlocks: string[] = [];
    let currentSpec = "";

    const unsubscribe = listen((data): void => {
      // Note: short-circuit if message isn't for the currently active spec when `runMode` is `single`
      if (
        state.runMode === "single" &&
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
              ...INITIAL_STATE,
              status: "idle",
              runMode: oldState.runMode,
            }));
          }
        }

        if (data.event === "test_count") {
          return;
        }

        if (data.event === "total_test_start") {
          currentDescribeBlocks = [];
          return setState((oldState) => ({ ...oldState, status: "running" }));
        }

        if (data.event === "total_test_end") {
          return setState((oldState) => ({
            ...oldState,
            status: "complete",
            runMode: "all",
          }));
        }

        if (data.event === "add_file") {
          return setState((oldState) =>
            immer(oldState, (state) => {
              state.specs[data.path] = {
                describes: {},
                tests: {},
                name: data.path,
              };
            })
          );
        }

        if (data.event === "remove_file") {
          return setState((oldState) =>
            immer(oldState, (state) => {
              if (state.specs[data.path]) {
                delete state.specs[data.path];
              }
            })
          );
        }

        if (data.event === "file_error") {
          return setState((oldState) =>
            immer(oldState, (state) => {
              if (state.specs[data.path]) {
                state.specs[data.path].error = data.error;
              }
            })
          );
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

          return setState((oldState) =>
            immer(oldState, (state) => {
              set(
                state.specs[spec],
                [
                  "describes",
                  ...flatMap(describePath, (name) => [name, "describes"]),
                  currentDescribe,
                ],
                {
                  name: data.blockName,
                  tests: {},
                  describes: {},
                }
              );
            })
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
          return setState((oldState) =>
            immer(oldState, (state) => {
              if (currentDescribe === undefined) {
                state.specs[data.path].tests[data.testName] = test;
              } else {
                set(
                  state.specs[data.path].describes,
                  [
                    ...flatMap(describePath, (name) => [name, "describes"]),
                    currentDescribe,
                    "tests",
                    data.testName,
                  ],
                  test
                );
              }
            })
          );
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

          return setState((oldState) =>
            immer(oldState, (state) => {
              if (currentDescribe === undefined) {
                state.specs[test.path].tests[test.name] = startedTest;
              } else {
                set(
                  state.specs[test.path].describes,
                  [
                    ...flatMap(describePath, (name: string) => [
                      name,
                      "describes",
                    ]),
                    currentDescribe,
                    "tests",
                    test.name,
                  ],
                  startedTest
                );
              }
            })
          );
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

          return setState((oldState) =>
            immer(oldState, (state) => {
              if (currentDescribe === undefined) {
                state.specs[test.path].tests[test.name] = endedTest;
              } else {
                set(
                  state.specs[test.path].describes,
                  [
                    ...flatMap(describePath, (name: string) => [
                      name,
                      "describes",
                    ]),
                    currentDescribe,
                    "tests",
                    test.name,
                  ],
                  endedTest
                );
              }
            })
          );
        }
      }
    });

    return unsubscribe;
  }, [state.runMode, state.watchMode, sandpack.activeFile]);

  const runAllTests = (): void => {
    setState((oldState) => ({
      ...oldState,
      status: "running",
      runMode: "all",
      specs: {},
    }));
    const client = getClient();
    if (client) {
      client.dispatch({ type: "run-all-tests" });
    }
  };

  const runSpec = (): void => {
    setState((oldState) => ({
      ...oldState,
      status: "running",
      runMode: "single",
      specs: {},
    }));
    const client = getClient();
    if (client) {
      client.dispatch({ type: "run-tests", path: sandpack.activeFile });
    }
  };

  const testFileRegex = /.*\.(test|spec)\.[tj]sx?$/;
  const isSpecOpen = sandpack.activeFile.match(testFileRegex) !== null;

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
    [sandpack.files[sandpack.activeFile].code, state.watchMode, isSpecOpen]
  );

  const openSpec = (file: string): void => {
    sandpack.setActiveFile(file);
  };

  const specs = Object.values(state.specs);
  const duration = getDuration(specs);
  const testResults = getAllTestResults(specs);
  const suiteResults = getAllSuiteResults(specs);

  return (
    <SandpackStack
      style={{
        ...setTestTheme(isDarkColor(theme.theme.colors.surface1)),
        ...style,
      }}
      {...props}
    >
      <iframe ref={iframe} style={{ display: "none" }} title="Sandpack Tests" />

      <Controls
        isSpecOpen={isSpecOpen}
        runAllTests={runAllTests}
        runSpec={runSpec}
        setVerbose={(): void =>
          setState((s) => ({ ...s, verbose: !s.verbose }))
        }
        setWatchMode={(): void => {
          setState((s) => ({ ...s, watchMode: !s.watchMode }));
        }}
        status={state.status}
        verbose={state.verbose}
        watchMode={state.watchMode}
      />

      <div className={classNames(containerClassName)}>
        {(state.status === "running" || state.status === "initialising") && (
          <Loading showOpenInCodeSandbox={false} />
        )}

        {specs.length === 0 && state.status === "complete" ? (
          <div className={classNames(fileErrorContainerClassName)}>
            <p>No test files found.</p>
            <p>
              Test match:{" "}
              <span className={classNames(failTextClassName)}>
                {testFileRegex.toString()}
              </span>
            </p>
          </div>
        ) : (
          <>
            <Specs
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
});
