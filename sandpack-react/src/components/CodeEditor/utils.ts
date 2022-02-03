import { HighlightStyle, tags } from "@codemirror/highlight";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { LanguageSupport } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import type { Text } from "@codemirror/text";
import { EditorView } from "@codemirror/view";
import * as React from "react";

import { THEME_PREFIX } from "../../styles";
import type { SandpackTheme } from "../../types";

export const getCodeMirrorPosition = (
  doc: Text,
  { line, column }: { line: number; column?: number }
): number => {
  return doc.line(line).from + (column ?? 0) - 1;
};

export const getEditorTheme = (theme: SandpackTheme): Extension =>
  EditorView.theme({
    "&": {
      backgroundColor: theme.colors.surface1,
      color:
        (typeof theme.syntax.plain === "string"
          ? theme.syntax.plain
          : theme.syntax.plain.color) || theme.colors.base,
      height: "100%",
    },

    "&.cm-editor.cm-focused": {
      outline: "none",
    },

    ".cm-activeLine": {
      // TODO: confirm
      backgroundColor: theme.colors.surface2,
      borderRadius: "4px",
    },

    ".cm-errorLine": {
      backgroundColor: theme.colors.errorSurface!,
    },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      color: "inherit",
      // TODO: confirm
      backgroundColor: theme.colors.surface2,
    },

    ".cm-content": {
      padding: 0,
      caretColor: theme.colors.accent,
      paddingRight: `var(--${THEME_PREFIX}-space-4)`,
    },

    ".cm-scroller": {
      fontFamily: theme.font.mono,
      lineHeight: theme.font.lineHeight,
    },

    ".cm-gutters": {
      backgroundColor: theme.colors.surface1,
      color: theme.colors.disabled,
      border: "none",
      padding: `0 var(--${THEME_PREFIX}-space-4) 0 var(--${THEME_PREFIX}-space-1)`,
    },

    ".cm-gutter.cm-lineNumbers": {
      fontSize: ".6em",
    },

    ".cm-lineNumbers .cm-gutterElement": {
      lineHeight: `var(--${THEME_PREFIX}-font-lineHeight)`,
    },

    ".cm-line": {},
  });

const classNameToken = (name: string): string =>
  `${THEME_PREFIX}-syntax-${name}`;

export const styleTokens = (): Record<string, string> => {
  const syntaxHighLightTokens: Array<keyof SandpackTheme["syntax"]> = [
    "string",
    "plain",
    "comment",
    "keyword",
    "definition",
    "punctuation",
    "property",
    "tag",
    "static",
  ];

  return syntaxHighLightTokens.reduce((acc, token) => {
    return {
      ...acc,
      [`.${classNameToken(token)}`]: {
        color: `$syntax$color$${token}`,
        fontStyle: `$syntax$fontStyle$${token}`,
      },
    };
  }, {});
};

export const getSyntaxHighlight = (theme: SandpackTheme): HighlightStyle =>
  HighlightStyle.define([
    { tag: tags.link, textDecoration: "underline" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },

    {
      tag: tags.keyword,
      class: classNameToken("keyword"),
    },
    {
      tag: [tags.atom, tags.number, tags.bool],
      class: classNameToken("static"),
    },
    {
      tag: tags.tagName,
      class: classNameToken("tag"),
    },
    { tag: tags.variableName, class: classNameToken("plain") },
    {
      // Highlight function call
      tag: tags.function(tags.variableName),
      class: classNameToken("definition"),
    },
    {
      // Highlight function definition differently (eg: functional component def in React)
      tag: tags.definition(tags.function(tags.variableName)),
      class: classNameToken("definition"),
    },
    {
      tag: tags.propertyName,
      class: classNameToken("property"),
    },
    {
      tag: [tags.literal, tags.inserted],
      class: classNameToken(theme.syntax.string ? "string" : "static"),
    },
    {
      tag: tags.punctuation,
      class: classNameToken("punctuation"),
    },
    {
      tag: [tags.comment, tags.quote],
      class: classNameToken("comment"),
    },
  ]);

type SandpackLanguageSupport = "javascript" | "typescript" | "html" | "css";

export const getLanguageFromFile = (
  filePath?: string,
  fileType?: string
): SandpackLanguageSupport => {
  if (!filePath && !fileType) return "javascript";

  let extension = fileType;
  if (!extension && filePath) {
    const extensionDotIndex = filePath.lastIndexOf(".");
    extension = filePath.slice(extensionDotIndex + 1);
  }

  switch (extension) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "html":
    case "svelte":
    case "vue":
      return "html";
    case "css":
    case "less":
    case "scss":
      return "css";
    default:
      return "javascript";
  }
};

export const getCodeMirrorLanguage = (
  extension: SandpackLanguageSupport
): LanguageSupport => {
  const options: Record<SandpackLanguageSupport, LanguageSupport> = {
    javascript: javascript({ jsx: true, typescript: false }),
    typescript: javascript({ jsx: true, typescript: true }),
    html: html(),
    css: css(),
  };

  return options[extension];
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
