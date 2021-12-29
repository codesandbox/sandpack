import { HighlightStyle, tags, TagStyle } from "@codemirror/highlight";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { LanguageSupport } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import type { Text } from "@codemirror/text";
import { EditorView } from "@codemirror/view";
import * as React from "react";
import { THEME_PREFIX } from "../../styles";

import type { SandpackSyntaxStyle, SandpackTheme } from "../../types";
import { hexToCSSRGBa } from "../../utils/stringUtils";

export const getCodeMirrorPosition = (
  doc: Text,
  { line, column }: { line: number; column?: number }
): number => {
  return doc.line(line).from + (column ?? 0) - 1;
};

export const getEditorTheme = (theme: SandpackTheme): Extension =>
  EditorView.theme({
    "&": {
      backgroundColor: theme.colors.defaultBackground,
      color:
        getSyntaxStyle(theme.syntax.plain).color || theme.colors.activeText,
      height: "100%",
    },

    "&.cm-editor.cm-focused": {
      outline: "none",
    },

    ".cm-activeLine": {
      backgroundColor: hexToCSSRGBa(theme.colors.activeBackground, 0.5),
    },

    ".cm-errorLine": {
      backgroundColor: hexToCSSRGBa(theme.colors.errorBackground, 0.2),
    },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      color: "inherit",
      background: theme.colors.activeBackground,
    },

    ".cm-content": {
      padding: 0,
      caretColor: theme.colors.activeText,
    },

    ".cm-scroller": {
      fontFamily: theme.font.mono,
      lineHeight: theme.font.lineHeight,
    },

    ".cm-gutters": {
      backgroundColor: theme.colors.defaultBackground,
      color: theme.colors.defaultText,
      border: "none",
    },

    ".cm-gutter.cm-lineNumbers": {
      paddingLeft: "var(--sp-space-1)",
      paddingRight: "var(--sp-space-1)",
    },

    ".cm-lineNumbers .cm-gutterElement": {
      padding: 0,
    },

    ".cm-line": {
      padding: "0 var(--sp-space-3)",
    },
  });

const getSyntaxStyle = (
  style: string | SandpackSyntaxStyle,
  name: string
): Omit<TagStyle, "tag"> => {
  const className = `${THEME_PREFIX}-syntax-${name}`;

  return { class: className };
};

export const getSyntaxHighlight = (theme: SandpackTheme): HighlightStyle =>
  HighlightStyle.define([
    { tag: tags.link, textDecoration: "underline" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },

    {
      tag: tags.keyword,
      ...getSyntaxStyle(theme.syntax.keyword, "keyword"),
    },
    {
      tag: [tags.atom, tags.number, tags.bool],
      ...getSyntaxStyle(theme.syntax.static, "static"),
    },
    {
      tag: tags.tagName,
      ...getSyntaxStyle(theme.syntax.tag, "tag"),
    },
    { tag: tags.variableName, ...getSyntaxStyle(theme.syntax.plain, "plain") },
    {
      // Highlight function call
      tag: tags.function(tags.variableName),
      ...getSyntaxStyle(theme.syntax.definition, "definition"),
    },
    {
      // Highlight function definition differently (eg: functional component def in React)
      tag: tags.definition(tags.function(tags.variableName)),
      ...getSyntaxStyle(theme.syntax.definition, "definition"),
    },
    {
      tag: tags.propertyName,
      ...getSyntaxStyle(theme.syntax.property, "property"),
    },
    {
      tag: [tags.literal, tags.inserted],
      ...getSyntaxStyle(
        theme.syntax.string ?? theme.syntax.static,
        theme.syntax.string ? "string" : "static"
      ),
    },
    {
      tag: tags.punctuation,
      ...getSyntaxStyle(theme.syntax.punctuation, "punctuation"),
    },
    {
      tag: [tags.comment, tags.quote],
      ...getSyntaxStyle(theme.syntax.comment, "comment"),
    },
  ]);

export const getCodeMirrorLanguage = (
  filePath?: string,
  fileType?: string
): LanguageSupport => {
  if (!filePath && !fileType) {
    return javascript();
  }

  let extension = fileType;
  if (!extension && filePath) {
    const extensionDotIndex = filePath.lastIndexOf(".");
    extension = filePath.slice(extensionDotIndex + 1);
  }

  switch (extension) {
    case "js":
    case "jsx":
      return javascript({ jsx: true, typescript: false });
    case "ts":
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "vue":
    case "html":
    case "svelte":
      return html();
    case "css":
    case "scss":
    case "less":
      return css();
    default:
      return javascript();
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCombinedRefs = <T extends any>(
  ...refs: Array<React.Ref<T>>
): React.Ref<T> =>
  React.useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }

        // Ref can have two types - a function or an object. We treat each case.
        if (typeof ref === "function") {
          return ref(element);
        }

        // As per https://github.com/facebook/react/issues/13029
        // it should be fine to set current this way.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref as any).current = element;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
