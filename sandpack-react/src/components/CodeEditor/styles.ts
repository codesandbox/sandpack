import { css, THEME_PREFIX } from "../../styles";
import type { SandpackTheme } from "../../types";

export const placeholderClassName = css({
  margin: "0",
  display: "block",
  padding: "0 $space$3",
  fontFamily: "$font$mono",
  fontSize: "$font$size",
  color: "$colors$activeText",
  lineHeight: "$font$lineHeight",
});

const classNameTokens = (): Record<string, string> => {
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
      [`.${THEME_PREFIX}-syntax-${token}`]: {
        color: `$syntax$color$${token}`,
        fontStyle: `$syntax$fontStyle$${token}`,
      },
    };
  }, {});
};

export const syntaxHighlightToken = css(classNameTokens());

export const editorClassName = css({
  flex: 1,
  position: "relative",
  overflow: "auto",
  background: "$colors$defaultBackground",
});

export const cmClassName = css({
  padding: "$space$4 0",
  margin: "0",
  outline: "none",
  height: "100%",

  "&:focus-visible": {
    boxShadow: "inset 0 0 0 4px $colors$accent",
    paddingLeft: "$space$1",
    paddingRight: "$space$1",
  },
  "&:focus-visible .cm-line": { padding: "0 $space$2" },
  "&:focus-visible .cm-gutter.cm-lineNumbers": {
    paddingLeft: "0",
    paddingRight: "$space$2",
  },
});
