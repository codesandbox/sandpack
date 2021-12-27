import { css, keyframes } from ".";

export const buttonClassName = css({
  appearance: "none",
  border: "0",
  outline: "none",
  padding: "$space$1 $space$3 $space$1 $space$2",
  borderRadius: "$border$radius",
  display: "flex",
  alignItems: "center",
  color: "$colors$defaultText",
  backgroundColor: "$colors$defaultBackground",
  fontSize: "inherit",
  fontFamily: "inherit",
  transition: "all 0.15s ease-in-out",

  "&:hover:not(:disabled)": {
    backgroundColor: "$colors$activeBackground",
    color: "$colors$activeText",
  },
  "&:disabled": { color: "$colors$inactiveText" },
  "&:focus": { outline: "none" },
  "&:focus-visible": { outline: "2px solid $colors$accent" },

  "&.sp-csb-icon-dark": {
    color: "$colors$defaultBackground",
  },

  "&.sp-csb-icon-dark:hover:not(:disabled)": {
    backgroundColor: "$colors-activeBackground",
    color: "var(--sp-colors-activeBackground",
  },
});

export const iconStandaloneClassName = css({
  padding: "$space$1",
  background: "#f8f9fbcf",
  backdropFilter: "blur(4px)",
  width: "$space$8",
  height: "$space$8",
});

export const explorerClassName = css({
  borderRadius: "0",
  width: "100%",
  height: "28px",

  svg: {
    marginRight: "$space$1",
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
