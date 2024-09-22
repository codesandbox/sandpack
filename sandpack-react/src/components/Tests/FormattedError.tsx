import type { TestError } from "@codesandbox/sandpack-client";
import * as React from "react";

import { css } from "../../styles";
import { useClassNames } from "../../utils/classNames";

import {
  failTextClassName,
  passTextClassName,
  titleTextClassName,
} from "./style";

interface Props {
  error: TestError;
  path: string;
}

const containerClassName = css({
  color: "$colors$hover",
  fontSize: "$font$size",
  padding: "$space$2",
  whiteSpace: "pre-wrap",
});

export const FormattedError: React.FC<Props> = ({ error, path }) => {
  const classNames = useClassNames();
  return (
    <div
      className={classNames("test-error", [containerClassName])}
      dangerouslySetInnerHTML={{ __html: formatDiffMessage(error, path) }}
    />
  );
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatDiffMessage = (error: TestError, path: string): string => {
  let finalMessage = "";
  if (error.matcherResult) {
    finalMessage = `<span>${escapeHtml(error.message ?? "")
      .replace(/(expected)/m, `<span class="${passTextClassName}">$1</span>`)
      .replace(/(received)/m, `<span class="${failTextClassName}">$1</span>`)
      .replace(/(Difference:)/m, `<span>$1</span>`)
      .replace(
        /(Expected:)(.*)/m,
        `<span>$1</span><span class="${passTextClassName}">$2</span>`
      )
      .replace(
        /(Received:)(.*)/m,
        `<span>$1</span><span class="${failTextClassName}">$2</span>`
      )
      .replace(/^(-.*)/gm, `<span class="${failTextClassName}">$1</span>`)
      .replace(
        /^(\+.*)/gm,
        `<span class="${passTextClassName}">$1</span>`
      )}</span>`;
  } else {
    finalMessage = escapeHtml(error.message ?? "");
  }

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
        ..._originalScriptCode.map((code) => (code.lineNumber + "").length)
      ) + 2;

    const margin = Array.from({ length: widestNumber }).map(() => " ");

    finalMessage += "<br />";
    finalMessage += "<br />";
    finalMessage += "<div>";
    _originalScriptCode
      .filter((s) => s.content.trim())
      .forEach((code) => {
        const currentLineMargin = (code.lineNumber + "").length;
        const newMargin = [...margin];
        newMargin.length -= currentLineMargin;
        if (code.highlight) {
          newMargin.length -= 2;
        }

        const toBeIndex = code.content.indexOf(".to");
        const toBeMargin = Array.from(
          { length: margin.length + toBeIndex - (widestNumber - 1) },
          () => " "
        );

        const content = escapeHtml(code.content)
          .replace(
            /(describe|test|it)(\()(&#039;|&quot;|`)(.*)(&#039;|&quot;|`)/m,
            `<span>$1$2$3</span><span class="${titleTextClassName}">$4</span><span>$5</span>`
          )
          .replace(
            /(expect\()(.*)(\)\..*)(to[\w\d]*)(\()(.*)(\))/m,
            `<span>$1</span><span class="${failTextClassName}">$2</span><span>$3</span><span style="text-decoration: underline; font-weight: 900">$4</span><span>$5</span><span class="${passTextClassName}">$6</span><span>$7</span>`
          );

        finalMessage +=
          `<div ${code.highlight ? `style="font-weight:200;"` : ``}>` +
          (code.highlight
            ? `<span class="${failTextClassName}">></span> `
            : "") +
          newMargin.join("") +
          escapeHtml("" + code.lineNumber) +
          " | " +
          content +
          "</div>" +
          (code.highlight
            ? "<div>" +
              margin.join("") +
              " | " +
              toBeMargin.join("") +
              `<span class="${failTextClassName}">^</span>` +
              "</div>"
            : "");
      });
    finalMessage += "</div>";
  }

  return finalMessage.replace(/(?:\r\n|\r|\n)/g, "<br />");
};
