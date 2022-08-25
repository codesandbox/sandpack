import type { TestError } from "@codesandbox/sandpack-client";
import React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import { colors } from "./config";

const testContainerClassName = css({
  marginLeft: "16px",
});

const containerClassName = css({
  marginBottom: "8px",
  color: "$colors$clickable",
});

const testClassName = css({
  marginBottom: "8px",
  color: "$colors$hover",
});

const durationClassName = css({
  marginLeft: "8px",
});

const passClassName = css({
  marginRight: "8px",
  color: colors.pass,
});

const failClassName = css({
  marginRight: "8px",
  color: colors.fail,
});

const skipClassName = css({
  marginRight: "8px",
  color: colors.skip,
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

export const Tests: React.FC<{ tests: Test[] }> = ({ tests }) => {
  return (
    <div className={classNames(testContainerClassName)}>
      {tests.map((test) => (
        <div key={test.name} className={classNames(containerClassName)}>
          {test.status === "pass" && (
            <span className={classNames(passClassName)}>✓</span>
          )}
          {test.status === "fail" && (
            <span className={classNames(failClassName)}>✕</span>
          )}
          {test.status === "idle" && (
            <span className={classNames(skipClassName)}>○</span>
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
