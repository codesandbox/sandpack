import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import type { Test } from "./Tests";
import { Tests } from "./Tests";
import { isEmpty } from "./utils";

export interface Describe {
  name: string;
  tests: Record<string, Test>;
  describes: Record<string, Describe>;
}

const nameClassName = css({
  color: "$colors$hover",
  marginBottom: "$space$2",
});

const containerClassName = css({
  marginLeft: "$space$4",
});

export const Describes: React.FC<{ describes: Describe[] }> = ({
  describes,
}) => {
  return (
    <>
      {describes.map((describe) => {
        if (isEmpty(describe)) {
          return null;
        }

        const tests = Object.values(describe.tests);
        const describes = Object.values(describe.describes);

        return (
          <div key={describe.name} className={classNames(containerClassName)}>
            <div className={classNames(nameClassName)}>{describe.name}</div>

            <Tests tests={tests} />

            <Describes describes={describes} />
          </div>
        );
      })}
    </>
  );
};
