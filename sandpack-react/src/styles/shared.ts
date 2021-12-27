import { css } from ".";

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
