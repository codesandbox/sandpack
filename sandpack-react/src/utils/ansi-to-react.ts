/**
 * Stole from https://github.com/nteract/ansi-to-react/blob/master/src/index.ts
 */

import type { AnserJsonEntry } from "anser";
import Anser from "anser";
import { escapeCarriageReturn } from "escape-carriage";
import * as React from "react";

/**
 * Converts ANSI strings into JSON output.
 * @name ansiToJSON
 * @function
 * @param {String} input The input string.
 * @param {boolean} use_classes If `true`, HTML classes will be appended
 *                              to the HTML output.
 * @return {Array} The parsed input.
 */
function ansiToJSON(input: string, use_classes = false): AnserJsonEntry[] {
  input = escapeCarriageReturn(fixBackspace(input));
  return Anser.ansiToJson(input, {
    json: true,
    remove_empty: true,
    use_classes,
  });
}

/**
 * Create a class string.
 * @name createClass
 * @function
 * @param {AnserJsonEntry} bundle
 * @return {String} class name(s)
 */
function createClass(bundle: AnserJsonEntry): string | null {
  let classNames = "";

  if (bundle.bg) {
    classNames += `${bundle.bg}-bg `;
  }
  if (bundle.fg) {
    classNames += `${bundle.fg}-fg `;
  }
  if (bundle.decoration) {
    classNames += `ansi-${bundle.decoration} `;
  }

  if (classNames === "") {
    return null;
  }

  classNames = classNames.substring(0, classNames.length - 1);
  return classNames;
}

/**
 * Create the style attribute.
 * @name createStyle
 * @function
 * @param {AnserJsonEntry} bundle
 * @return {Object} returns the style object
 */
function createStyle(bundle: AnserJsonEntry): React.CSSProperties {
  const style: React.CSSProperties = {};
  if (bundle.bg) {
    style.backgroundColor = `rgb(${bundle.bg})`;
  }
  if (bundle.fg) {
    style.color = `rgb(${bundle.fg})`;
  }
  switch (bundle.decoration) {
    case "bold":
      style.fontWeight = "bold";
      break;
    case "dim":
      style.opacity = "0.5";
      break;
    case "italic":
      style.fontStyle = "italic";
      break;
    case "hidden":
      style.visibility = "hidden";
      break;
    case "strikethrough":
      style.textDecoration = "line-through";
      break;
    case "underline":
      style.textDecoration = "underline";
      break;
    case "blink":
      style.textDecoration = "blink";
      break;
    default:
      break;
  }
  return style;
}

/**
 * Converts an Anser bundle into a React Node.
 * @param linkify whether links should be converting into clickable anchor tags.
 * @param useClasses should render the span with a class instead of style.
 * @param bundle Anser output.
 * @param key
 */

function convertBundleIntoReact(
  linkify: boolean,
  useClasses: boolean,
  bundle: AnserJsonEntry,
  key: number
): JSX.Element {
  const style = useClasses ? null : createStyle(bundle);
  const className = useClasses ? createClass(bundle) : null;

  if (!linkify) {
    return React.createElement(
      "span",
      { style, key, className },
      bundle.content
    );
  }

  const content: React.ReactNode[] = [];
  const linkRegex =
    /(\s|^)(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;

  let index = 0;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(bundle.content)) !== null) {
    const [, pre, url] = match;

    const startIndex = match.index + pre.length;
    if (startIndex > index) {
      content.push(bundle.content.substring(index, startIndex));
    }

    // Make sure the href we generate from the link is fully qualified. We assume http
    // if it starts with a www because many sites don't support https
    const href = url.startsWith("www.") ? `http://${url}` : url;
    content.push(
      React.createElement(
        "a",
        {
          key: index,
          href,
          target: "_blank",
        },
        `${url}`
      )
    );

    index = linkRegex.lastIndex;
  }

  if (index < bundle.content.length) {
    content.push(bundle.content.substring(index));
  }

  return React.createElement("span", { style, key, className }, content);
}

declare interface Props {
  children?: string;
  linkify?: boolean;
  className?: string;
  useClasses?: boolean;
}

export default function Ansi(props: Props): JSX.Element {
  const { className, useClasses, children, linkify } = props;
  return React.createElement(
    "code",
    { className },
    ansiToJSON(children ?? "", useClasses ?? false).map(
      convertBundleIntoReact.bind(null, linkify ?? false, useClasses ?? false)
    )
  );
}

// This is copied from the Jupyter Classic source code
// notebook/static/base/js/utils.js to handle \b in a way
// that is **compatible with Jupyter classic**.   One can
// argue that this behavior is questionable:
//   https://stackoverflow.com/questions/55440152/multiple-b-doesnt-work-as-expected-in-jupyter#
function fixBackspace(txt: string) {
  let tmp = txt;
  do {
    txt = tmp;
    // Cancel out anything-but-newline followed by backspace
    // eslint-disable-next-line no-control-regex
    tmp = txt.replace(/[^\n]\x08/gm, "");
  } while (tmp.length < txt.length);
  return txt;
}
