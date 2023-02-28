import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import {
  failTextClassName,
  passTextClassName,
  skipTextClassName,
} from "./style";

export interface TestResults {
  pass: number;
  fail: number;
  skip: number;
  total: number;
}

export interface SuiteResults {
  pass: number;
  fail: number;
  total: number;
}

interface Props {
  suites: SuiteResults;
  tests: TestResults;
  duration: number;
}

const gapBottomClassName = css({
  marginBottom: "$space$2",
});

const labelClassName = css({
  fontWeight: "bold",
  color: "$colors$hover",
  whiteSpace: "pre-wrap",
});
const containerClassName = css({
  fontWeight: "bold",
  color: "$colors$clickable",
});

export const Summary: React.FC<Props> = ({ suites, tests, duration }) => {
  const widestLabel = "Test suites: ";

  const withMargin = (label: string): string => {
    const difference = widestLabel.length - label.length;
    const margin = Array.from({ length: difference }, () => " ").join("");
    return label + margin;
  };

  return (
    <div className={classNames(containerClassName)}>
      <div className={classNames(gapBottomClassName)}>
        <span className={classNames(labelClassName)}>{widestLabel}</span>
        {suites.fail > 0 && (
          <span className={classNames(failTextClassName)}>
            {suites.fail} failed,{" "}
          </span>
        )}
        {suites.pass > 0 && (
          <span className={classNames(passTextClassName)}>
            {suites.pass} passed,{" "}
          </span>
        )}
        <span>{suites.total} total</span>
      </div>
      <div className={classNames(gapBottomClassName)}>
        <span className={classNames(labelClassName)}>
          {withMargin("Tests:")}
        </span>
        {tests.fail > 0 && (
          <span className={classNames(failTextClassName)}>
            {tests.fail} failed,{" "}
          </span>
        )}
        {tests.skip > 0 && (
          <span className={classNames(skipTextClassName)}>
            {tests.skip} skipped,{" "}
          </span>
        )}
        {tests.pass > 0 && (
          <span className={classNames(passTextClassName)}>
            {tests.pass} passed,{" "}
          </span>
        )}
        <span>{tests.total} total</span>
      </div>
      <div className={classNames(labelClassName)}>
        {withMargin("Time:")}
        {duration / 1000}s
      </div>
    </div>
  );
};
