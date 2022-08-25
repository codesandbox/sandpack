import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

import type { Describe } from "./Describes";
import { Describes } from "./Describes";
import { FormattedError } from "./FormattedError";
import type { Test, TestError } from "./Message";
import type { Outcome } from "./Summary";
import { Tests } from "./Tests";
import { colors } from "./config";

import type { Status } from ".";

export type Spec = { error?: TestError } & Describe;

interface Props {
  specs: Spec[];
  verbose: boolean;
  status: Status;
  openSpec: (name: string) => void;
}

const fileContainer = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "8px",
});

const specContainerClassName = css({
  marginBottom: "8px",
});

const failingTestContainer = css({
  marginBottom: "8px",
});

const failTestClassName = css({
  color: colors.failMessage,
  fontWeight: "bold",
});

const passLabelClassName = css({
  background: colors.pass,
});
const failLabelClassName = css({
  background: colors.fail,
});

const specLabelClassName = css({
  marginRight: "8px",
  padding: "4px 8px",
  fontFamily: "Consolas, Monaco, monospace",
  textTransform: "uppercase",
});

const filePathButtonClassName = css({
  appearance: "none",
  border: "0",
  padding: "0",
  margin: "0",
  outline: "none",
  background: "none",
  fontFamily: "Consolas, Monaco, monospace",
  cursor: "pointer",
});

const filePathClassName = css({
  color: "$colors$clickable",
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});

const fileNameClassName = css({
  color: "$colors$hover",
  textDecorationLine: "underline",
  textDecorationStyle: "dotted",
  fontWeight: "bold",
});

export const Specs: React.FC<Props> = ({
  specs,
  openSpec,
  status,
  verbose,
}) => {
  return (
    <>
      {specs.map((spec) => {
        if (spec.error) {
          return (
            <div key={spec.name} className={classNames(specContainerClassName)}>
              <SpecLabel className={classNames(failLabelClassName)}>
                Error
              </SpecLabel>
              <FilePath
                onClick={(): void => openSpec(spec.name)}
                path={spec.name}
              />
              <FormattedError error={spec.error} path={spec.name} />
            </div>
          );
        }

        const tests = Object.values(spec.tests);
        const describes = Object.values(spec.describes);

        if (describes.length === 0 && tests.length === 0) {
          return null;
        }

        const stats = getStats(spec);

        return (
          <div key={spec.name} className={classNames(specContainerClassName)}>
            <div className={classNames(fileContainer)}>
              {status === "complete" &&
                (stats.fail > 0 ? (
                  <SpecLabel className={classNames(failLabelClassName)}>
                    Fail
                  </SpecLabel>
                ) : (
                  <SpecLabel className={classNames(passLabelClassName)}>
                    Pass
                  </SpecLabel>
                ))}

              <FilePath
                onClick={(): void => openSpec(spec.name)}
                path={spec.name}
              />
            </div>

            {verbose && <Tests tests={tests} />}

            {verbose && <Describes describes={describes} />}

            {getFailingTests(spec).map((test) => {
              return (
                <div
                  key={`failing-${test.name}`}
                  className={classNames(failingTestContainer)}
                >
                  <div className={classNames(failTestClassName)}>
                    ● {test.blocks.join(" › ")} › {test.name}
                  </div>
                  {test.errors.map((e) => (
                    <FormattedError
                      key={`failing-${test.name}-error`}
                      error={e}
                      path={test.path}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

const SpecLabel: React.FC<{ className: string; children: React.ReactNode }> = ({
  children,
  className,
}) => {
  return (
    <span className={classNames(specLabelClassName, className)}>
      {children}
    </span>
  );
};

const FilePath: React.FC<{ onClick: () => void; path: string }> = ({
  onClick,
  path,
}) => {
  const parts = path.split("/");
  const basePath = parts.slice(0, parts.length - 1).join("/") + "/";
  const fileName = parts[parts.length - 1];
  return (
    <button className={classNames(filePathButtonClassName)} onClick={onClick}>
      <span className={classNames(filePathClassName)}>{basePath}</span>
      <span className={classNames(fileNameClassName)}>{fileName}</span>
    </button>
  );
};

// TODO: Tidy these
const getFailingTests = (block: Describe | Spec): Test[] => {
  return getTests(block).filter((t) => t.status === "fail");
};

const getTests = (block: Describe | Spec): Test[] => {
  const tests = Object.values(block.tests);
  return tests.concat(...Object.values(block.describes).map(getTests));
};

const getStats = (spec: Spec): Outcome => {
  const allTests = getTests(spec);

  const sum = (
    tests: Test[]
  ): { pass: number; fail: number; skip: number; total: number } =>
    tests.reduce(
      (acc, test) => {
        return {
          pass: test.status === "pass" ? acc.pass + 1 : acc.pass,
          fail: test.status === "fail" ? acc.fail + 1 : acc.fail,
          skip:
            test.status === "idle" || test.status === "running"
              ? acc.skip + 1
              : acc.skip,
          total: acc.total + 1,
        };
      },
      { pass: 0, fail: 0, skip: 0, total: 0 }
    );

  return sum(allTests);
};
