import { buttonClassName } from "../../styles/shared";

import { styleTokens } from "./utils";

export const placeholderClassName = {
  margin: "0",
  display: "block",
  fontFamily: "$font$mono",
  fontSize: "$font$size",
  color: "$syntax$color$plain",
  lineHeight: "$font$lineHeight",
};

export const tokensClassName = styleTokens();

export const editorClassName = {
  flex: 1,
  position: "relative",
  overflow: "auto",
  background: "$colors$surface1",

  ".cm-scroller": {
    padding: "$space$4 0",
  },

  [`.${placeholderClassName}`]: {
    padding: "$space$4 0",
  },
};

export const cmClassName = {
  margin: "0",
  outline: "none",
  height: "100%",
};

export const readOnlyClassName = {
  fontFamily: "$font$mono",
  fontSize: "0.8em",
  position: "absolute",
  right: "$space$2",
  bottom: "$space$2",
  zIndex: "$top",
  color: "$colors$clickable",
  backgroundColor: "$colors$surface2",
  borderRadius: "99999px",
  padding: "calc($space$1 / 2) $space$2",

  [`& + .${buttonClassName}`]: {
    right: "calc($space$11 * 2)",
  },
};
