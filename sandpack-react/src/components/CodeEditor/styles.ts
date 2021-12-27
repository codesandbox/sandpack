import { css } from "../../styles";

export const placeholderClassName = css({
  margin: "0",
  display: "block",
  padding: "0 $space$3",
  fontFamily: "$font$mono",
  fontSize: "$font$size",
  color: "$colors$activeText",
  lineHeight: "$font$lineHeight",
});

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
