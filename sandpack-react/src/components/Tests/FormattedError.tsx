import type { TestError } from "@codesandbox/sandpack-client";
import * as React from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import type { Cursor } from "../../types";
import { classNames } from "../../utils/classNames";

import {
  failTextClassName,
  passTextClassName,
  titleTextClassName,
} from "./style";
import { ReactStringReplacer } from "./utils";

interface Props {
  error: TestError;
  path: string;
  openSpec: (cursor: Cursor) => void;
}

const containerClassName = css({
  color: "$colors$hover",
  fontSize: "$font$size",
  padding: "$space$2",
  whiteSpace: "pre-wrap",
});

const matcherButtonClassName = css({
  fontFamily: "$font$mono",
  cursor: "pointer",
  display: "inline-block",
  padding: "0",
});

const matcherClassName = css({
  color: "$colors$hover",
  fontWeight: "bold",
  textDecorationStyle: "dotted",
  textDecorationLine: "underline",
});

const makeMargin = (length: number): string =>
  Array.from({ length }, () => " ").join("");

export const FormattedError: React.FC<Props> = ({ error, path, openSpec }) => {
  if (!error.matcherResult) {
    return (
      <div
        className={classNames(containerClassName)}
        dangerouslySetInnerHTML={{ __html: escapeHtml(error.message) }}
      />
    );
  } else {
    const matcherResult = new ReactStringReplacer(error.message)
      .replace(/(expected)/m, (match) => (
        <span className={passTextClassName}>{match}</span>
      ))
      .replace(/(received)/m, (match) => (
        <span className={failTextClassName}>{match}</span>
      ))
      .replace(/(Difference)/m, (match) => <span>{match}</span>)
      .replace(/((?<=Expected:\s).*)/m, (match) => (
        <span className={passTextClassName}>{match}</span>
      ))
      .replace(/((?<=Received:\s).*)/m, (match) => (
        <span className={failTextClassName}>{match}</span>
      ))
      .replace(/^(-.*)/gm, (match) => (
        <span className={passTextClassName}>{match}</span>
      ))
      .replace(/^(\+.*)/gm, (match) => (
        <span className={failTextClassName}>{match}</span>
      ))
      .replace(/(\n)/gm, () => <br />)
      .get();

    let mappedErrors: React.ReactNode = null;

    if (
      error.mappedErrors &&
      error.mappedErrors[0] &&
      error.mappedErrors[0].fileName.endsWith(path) &&
      error.mappedErrors[0]._originalScriptCode
    ) {
      const mappedError = error.mappedErrors[0];
      const _originalScriptCode = mappedError._originalScriptCode || [];
      const widestNumber =
        Math.max(
          ..._originalScriptCode.map(
            (code) => code.lineNumber.toString().length
          )
        ) + 2;

      mappedErrors = _originalScriptCode.map((code) => {
        const lineNumber = code.lineNumber.toString();
        const margin = makeMargin(widestNumber - lineNumber.length);
        const matcherColumn = code.content.indexOf(".to") + 1;

        const content = new ReactStringReplacer(code.content)
          .match(
            /(expect\()(.*)(\)\..*)(to[\w\d]*)(\()(.*)(\))/m,
            ([$0, $1, $2, $3, $4, $5, $6, $7, $8]) => (
              <>
                <span>{$0}</span>
                <span>{$1}</span>
                <span className={failTextClassName}>{$2}</span>
                <span>{$3}</span>
                <button
                  className={classNames(
                    buttonClassName,
                    matcherButtonClassName
                  )}
                  onClick={(): void =>
                    openSpec({ line: code.lineNumber, column: matcherColumn })
                  }
                >
                  <span className={classNames(matcherClassName)}>{$4}</span>
                </button>
                <span>{$5}</span>
                <span className={passTextClassName}>{$6}</span>
                <span>{$7}</span>
                <span>{$8}</span>
              </>
            )
          )
          .match(
            /(describe|test|it)(\()("|'|`)(.*)("|'|`)/m,
            ([$0, $1, $2, $3, $4, $5, $6]) => (
              <>
                <span>
                  {$0}
                  {$1}
                  {$2}
                  {$3}
                </span>
                <span className={titleTextClassName}>{$4}</span>
                <span>{$5}</span>
                <span>{$6}</span>
              </>
            )
          );

        return (
          <>
            <div style={{ fontWeight: code.highlight ? `200` : `` }}>
              {code.highlight ? (
                <span className={failTextClassName}>
                  &gt; {makeMargin(margin.length - 2)}
                </span>
              ) : (
                margin
              )}
              {lineNumber}
              {" | "}
              {content.get()}
            </div>
            {code.highlight && (
              <div>
                {makeMargin(margin.length + lineNumber.length)}
                {" | "}
                {makeMargin(matcherColumn)}
                <span className={failTextClassName}>^</span>
              </div>
            )}
          </>
        );
      });
    }

    return (
      <div className={classNames(containerClassName)}>
        <span>{matcherResult}</span>
        <div>
          <br />
          <br />
          {mappedErrors}
        </div>
      </div>
    );
  }
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
