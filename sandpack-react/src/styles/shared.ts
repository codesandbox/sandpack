import { css, keyframes } from ".";

export const iconStandaloneClassName = css({
  svg: { margin: "auto" },
});

export const buttonClassName = css({
  appearance: "none",
  outline: "none",
  display: "flex",
  alignItems: "center",
  fontSize: "inherit",
  fontFamily: "inherit",
  backgroundColor: "transparent",
  transition: "color $default, background $default",
  cursor: "pointer",
  color: "$colors$clickable",
  border: 0,
  textDecoration: "none",

  "&:disabled": { color: "$colors$disabled" },

  "&:hover:not(:disabled,[data-active='true'])": { color: "$colors$hover" },

  '&[data-active="true"]': { color: "$colors$accent" },

  svg: {
    minWidth: "$space$4",
    width: "$space$4",
    height: "$space$4",
  },

  [`&.${iconStandaloneClassName}`]: {
    padding: "$space$1",
    height: "$space$7",
    display: "flex",
  },

  // If there's a children besides the icon
  [`&.${iconStandaloneClassName}&:not(:has(span))`]: {
    width: "$space$7",
  },

  [`&.${iconStandaloneClassName}&:has(svg + span)`]: {
    paddingRight: "$space$3",
    paddingLeft: "$space$2",
    gap: "$space$1",
  },
});

export const roundedButtonClassName = css({
  backgroundColor: "$colors$surface2",
  borderRadius: "99999px",
  border: "1px solid $colors$surface3",

  '&[data-active="true"]': {
    color: "$colors$surface1",
    background: "$colors$accent",
  },

  "&:hover:not(:disabled,[data-active='true'])": {
    backgroundColor: "$colors$surface3",
  },
});

export const iconClassName = css({ padding: 0 });

export const fadeIn = keyframes({
  "0%": {
    opacity: 0,
  },

  "100%": {
    opacity: 1,
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
  whiteSpace: "pre-wrap",
  padding: "$space$10",
  backgroundColor: "$colors$surface1",
  display: "flex",
  gap: "$space$2",
  flexDirection: "column",

  [`.${buttonClassName}`]: {
    width: "auto",
    gap: "$space$2",
    padding: "0 $space$3 0 $space$2",
    marginTop: "$space$1",
  },

  variants: {
    solidBg: {
      true: {
        backgroundColor: "$colors$errorSurface",
      },
    },
  },
});

export const errorBundlerClassName = css({
  padding: "$space$10",
  backgroundColor: "$colors$surface1",

  [`.${buttonClassName}`]: {
    marginTop: "$space$6",
    width: "auto",
    gap: "$space$2",
    padding: "0 $space$3 0 $space$2",
  },
});

export const errorMessageClassName = css({
  animation: `${fadeIn} 150ms ease`,
  color: "$colors$error",
  display: "flex",
  flexDirection: "column",
  gap: "$space$3",

  variants: {
    errorCode: { true: { fontFamily: "$font$mono" } },
  },

  a: {
    color: "inherit",
  },

  p: {
    margin: 0,
  },
});
