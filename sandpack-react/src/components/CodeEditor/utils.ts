import { HighlightStyle, tags } from "@codemirror/highlight";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { LanguageSupport } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { getSyntaxStyle } from "../../themes";
import type { SandpackTheme } from "../../types";
import { hexToCSSRGBa } from "../../utils/stringUtils";

export const getEditorTheme = (theme: SandpackTheme): Extension =>
  EditorView.theme({
    "&": {
      backgroundColor: theme.palette.defaultBackground,
      color:
        getSyntaxStyle(theme.syntax.plain).color || theme.palette.activeText,
      height: "100%",
    },

    "&.cm-focused": {
      outline: "none",
    },

    ".cm-activeLine": {
      backgroundColor: hexToCSSRGBa(theme.palette.activeBackground, 0.5),
    },

    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      color: "inherit",
      background: theme.palette.activeBackground,
    },

    ".cm-content": {
      padding: 0,
      caretColor: theme.palette.activeText,
    },

    ".cm-scroller": {
      fontFamily: theme.typography.monoFont,
    },

    ".cm-gutters": {
      backgroundColor: theme.palette.defaultBackground,
      color: theme.palette.defaultText,
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

export const getSyntaxHighlight = (theme: SandpackTheme): HighlightStyle =>
  HighlightStyle.define([
    { tag: tags.link, textDecoration: "underline" },
    { tag: tags.emphasis, fontStyle: "italic" },
    { tag: tags.strong, fontWeight: "bold" },

    {
      tag: tags.keyword,
      ...getSyntaxStyle(theme.syntax.keyword),
    },
    {
      tag: [tags.atom, tags.number, tags.bool],
      ...getSyntaxStyle(theme.syntax.static),
    },
    {
      tag: tags.typeName,
      ...getSyntaxStyle(theme.syntax.tag),
    },
    { tag: tags.variableName, ...getSyntaxStyle(theme.syntax.plain) },
    {
      tag: tags.definition(tags.function(tags.variableName)),
      ...getSyntaxStyle(theme.syntax.definition),
    },
    {
      tag: [tags.literal, tags.inserted],
      ...getSyntaxStyle(theme.syntax.string ?? theme.syntax.static),
    },
    {
      tag: tags.propertyName,
      ...getSyntaxStyle(theme.syntax.property),
    },
    { tag: tags.punctuation, ...getSyntaxStyle(theme.syntax.punctuation) },
    { tag: tags.comment, ...getSyntaxStyle(theme.syntax.comment) },
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
      return html();
    case "css":
    case "scss":
    case "less":
      return css();
    default:
      return javascript();
  }
};
