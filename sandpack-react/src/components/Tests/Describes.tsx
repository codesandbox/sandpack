import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import type { Test } from "./Message";
import { Tests } from "./Tests";

export interface Describe {
  name: string;
  tests: Record<string, Test>;
  describes: Record<string, Describe>;
}

const nameClassName = css({
  marginBottom: "8px",
  color: "$colors$hover",
});

const containerClassName = css({
  marginLeft: "16px",
});

export const Describes: React.FC<{ describes: Describe[] }> = ({
  describes,
}) => {
  if (describes.length === 0) return null;
  return (
    <>
      {describes.map((describe) => (
        <DescribeC key={describe.name} describe={describe} />
      ))}
    </>
  );
};

// TODO: Rename
const DescribeC: React.FC<{ describe: Describe }> = ({ describe }) => {
  if (
    Object.values(describe.describes).length === 0 &&
    Object.values(describe.tests).length === 0
  ) {
    return null;
  }

  const tests = Object.values(describe.tests);
  const describes = Object.values(describe.describes);

  return (
    <div className={classNames(containerClassName)}>
      <div className={classNames(nameClassName)}>{describe.name}</div>

      <Tests tests={tests} />

      <Describes describes={describes} />
    </div>
  );
};
