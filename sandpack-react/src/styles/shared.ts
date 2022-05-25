import { css, keyframes } from ".";

export const iconStandaloneClassName = css({
  svg: { margin: "auto" },
});

export const buttonClassName = css({
  appearance: "none",
  border: "0",
  outline: "none",
  display: "flex",
  alignItems: "center",
  fontSize: "inherit",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  transition: "color $default, background $default",
  cursor: "pointer",

  color: "$colors$clickable",

  "&:disabled": { color: "$colors$disabled" },

  "&:hover:not(:disabled,[data-active='true'])": { color: "$colors$hover" },

  '&[data-active="true"]': { color: "$colors$accent" },

  [`&.${iconStandaloneClassName}`]: {
    padding: "$space$1",
    width: "$space$8",
    height: "$space$8",
    display: "flex",
  },
});

export const actionButtonClassName = css({
  backgroundColor: "$colors$surface2",
  borderRadius: "99999px",
  transition: "all $transitions$default",

  "&:hover": {
    backgroundColor: "$colors$surface3",
    color: "$colors$hover",
  },
});

export const iconClassName = css({ padding: 0 });

const fadeIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(4px)",
  },

  "100%": {
    opacity: 1,
    transform: "translateY(0)",
  },
});

export const absoluteClassName = css({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  top: "0",
  margin: "0",
  overflow: "auto",
  height: "100%",
  zIndex: "$top",
});

export const errorClassName = css({
  padding: "$space$4",
  whiteSpace: "pre-wrap",
  fontFamily: "$font$mono",
  backgroundColor: "$colors$errorSurface",
});

export const errorMessageClassName = css({
  animation: `${fadeIn} 150ms ease`,
  color: "$colors$error",
});
