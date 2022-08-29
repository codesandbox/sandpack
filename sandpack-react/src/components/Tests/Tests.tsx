import type { TestError } from "@codesandbox/sandpack-client";
import React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import {
  failTextClassName,
  passTextClassName,
  skipTextClassName,
} from "./style";

const testContainerClassName = css({
  marginLeft: "$space$4",
});

const containerClassName = css({
  marginBottom: "$space$2",
  color: "$colors$clickable",
});

const testClassName = css({
  marginBottom: "$space$2",
  color: "$colors$hover",
});

const durationClassName = css({
  marginLeft: "$space$2",
});

const gapRightClassName = css({
  marginRight: "$space$2",
});

type TestStatus = "idle" | "running" | "pass" | "fail";

export interface Test {
  name: string;
  blocks: string[];
  status: TestStatus;
  path: string;
  errors: TestError[];
  duration?: number | undefined;
}

interface SandpackTests extends React.HtmlHTMLAttributes<HTMLDivElement> {
  tests: Test[];
}

export const Tests: React.FC<SandpackTests> = ({ tests, style }) => {
  return (
    <div className={classNames(testContainerClassName)}>
      {tests.map((test) => (
        <div key={test.name} className={classNames(containerClassName)}>
          {test.status === "pass" && (
            <span className={classNames(passTextClassName, gapRightClassName)}>
              ✓
            </span>
          )}
          {test.status === "fail" && (
            <span className={classNames(failTextClassName, gapRightClassName)}>
              ✕
            </span>
          )}
          {test.status === "idle" && (
            <span className={classNames(skipTextClassName, gapRightClassName)}>
              ○
            </span>
          )}
          <span className={classNames(testClassName)}>{test.name}</span>
          {test.duration !== undefined && (
            <span className={classNames(durationClassName)}>
              ({test.duration} ms)
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
