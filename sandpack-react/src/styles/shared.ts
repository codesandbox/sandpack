import { css, keyframes } from ".";

export const iconStandaloneClassName = css({});

export const buttonClassName = css({
  appearance: "none",
  border: "0",
  outline: "none",
  display: "flex",
  alignItems: "center",
  fontSize: "inherit",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  transition: "all $default",

  color: "$colors$clickable",

  // TODO: increase the contrast
  "&:disabled": { color: "$colors$disabled" },

  "&:hover:not(:disabled)": { color: "$colors$hover" },

  [`&.${iconStandaloneClassName}`]: {
    padding: "$space$1",
    backdropFilter: "blur(4px)",
    width: "$space$8",
    height: "$space$8",
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

export const errorOverlayClassName = css({
  position: "absolute",
  bottom: "0",
  left: "0",
  right: "0",
  top: "0",
  margin: "0",
  overflow: "auto",
  height: "100%",
  zIndex: 3,
});

export const errorClassName = css({
  padding: "$space$4",
  whiteSpace: "pre-wrap",
  fontFamily: "$font$mono",
  backgroundColor: "$colors$errorBackground",
});

export const errorMessageClassName = css({
  animation: `${fadeIn} 0.15s ease-in`,
  color: "$colors$errorForeground",
});
