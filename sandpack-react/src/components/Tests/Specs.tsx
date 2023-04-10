import type { TestError } from "@codesandbox/sandpack-client";
import * as React from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";

import type { Describe } from "./Describes";
import { Describes } from "./Describes";
import { FormattedError } from "./FormattedError";
import type { Status } from "./SandpackTests";
import { Tests } from "./Tests";
import {
  failBackgroundClassName,
  failTextClassName,
  passBackgroundClassName,
  runBackgroundClassName,
} from "./style";
import { getFailingTests, getSpecTestResults, isEmpty } from "./utils";

export type Spec = { error?: TestError } & Describe;

interface Props {
  specs: Spec[];
  verbose: boolean;
  status: Status;
  openSpec: (name: string) => void;
  hideTestsAndSupressLogs?: boolean;
}

const fileContainer = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: "$space$2",
});

const gapBottomClassName = css({
  marginBottom: "$space$2",
});

const failTestClassName = css({
  fontWeight: "bold",
});

const labelClassName = css({
  borderRadius: "calc($border$radius / 2)",
});

const specLabelClassName = css({
  padding: "$space$1 $space$2",
  fontFamily: "$font$mono",
  textTransform: "uppercase",
  marginRight: "$space$2",
});

const filePathButtonClassName = css({
  fontFamily: "$font$mono",
  cursor: "pointer",
  display: "inline-block",
});

const filePathClassName = css({
  color: "$colors$clickable",
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});

const fileNameClassName = css({
  color: "$colors$hover",
  fontWeight: "bold",
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});

export const Specs: React.FC<Props> = ({
  specs,
  openSpec,
  status,
  verbose,
  hideTestsAndSupressLogs,
}) => {
  const classNames = useClassNames();

  return (
    <>
      {specs.map((spec) => {
        if (spec.error) {
          return (
            <div
              key={spec.name}
              className={classNames("test-spec", [gapBottomClassName])}
            >
              <SpecLabel
                className={classNames("test-spec-error", [
                  labelClassName,
                  failBackgroundClassName,
                ])}
              >
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

        if (isEmpty(spec)) {
          return null;
        }

        const tests = Object.values(spec.tests);
        const describes = Object.values(spec.describes);
        const stats = getSpecTestResults(spec);

        return (
          <div
            key={spec.name}
            className={classNames("test-spec-name", [gapBottomClassName])}
          >
            <div
              className={classNames("test-spec-name-container", [
                fileContainer,
              ])}
            >
              {status === "complete" ? (
                stats.fail > 0 ? (
                  <SpecLabel
                    className={classNames("test-spec-complete", [
                      labelClassName,
                      failBackgroundClassName,
                    ])}
                  >
                    Fail
                  </SpecLabel>
                ) : (
                  <SpecLabel
                    className={classNames("test-spec-pass", [
                      labelClassName,
                      passBackgroundClassName,
                    ])}
                  >
                    Pass
                  </SpecLabel>
                )
              ) : (
                <SpecLabel
                  className={classNames("test-spec-run", [
                    labelClassName,
                    runBackgroundClassName,
                  ])}
                >
                  Run
                </SpecLabel>
              )}

              <FilePath
                onClick={(): void => {
                  if (!hideTestsAndSupressLogs) {
                    openSpec(spec.name);
                  }
                }}
                path={spec.name}
              />
            </div>

            {verbose && !hideTestsAndSupressLogs && <Tests tests={tests} />}

            {verbose && !hideTestsAndSupressLogs && (
              <Describes describes={describes} />
            )}

            {!hideTestsAndSupressLogs &&
              getFailingTests(spec).map((test) => {
                return (
                  <div
                    key={`failing-${test.name}`}
                    className={classNames("test-spec-error", [
                      gapBottomClassName,
                    ])}
                  >
                    <div
                      className={classNames("test-spec-error-text", [
                        failTestClassName,
                        failTextClassName,
                      ])}
                    >
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
  const classNames = useClassNames();

  return (
    <span
      className={classNames("test-spec-label", [specLabelClassName, className])}
    >
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
  const classNames = useClassNames();

  return (
    <button
      className={classNames("test-filename", [
        buttonClassName,
        filePathButtonClassName,
      ])}
      onClick={onClick}
      type="button"
    >
      <span className={classNames("test-filename-base", [filePathClassName])}>
        {basePath}
      </span>
      <span className={classNames("test-filename-file", [fileNameClassName])}>
        {fileName}
      </span>
    </button>
  );
};
