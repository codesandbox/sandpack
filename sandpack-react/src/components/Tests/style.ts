import { css } from "../../styles";

export const setTestTheme = (isDark: boolean): Record<string, string> => ({
  "--test-pass": isDark ? "#18df16" : "#15c213",
  "--test-fail": isDark ? "#df162b" : "#c21325",
  "--test-skip": isDark ? "#eace2b" : "#c2a813",
});

const color = css({
  variants: {
    status: {
      pass: { color: "var(--test-pass)" },
      fail: { color: "var(--test-fail)" },
      skip: { color: "var(--test-skip)" },
    },
  },
});

export const passTextClassName = color({ status: "pass" });
export const failTextClassName = color({ status: "fail" });
export const skipTextClassName = color({ status: "skip" });

const background = css({
  variants: {
    status: {
      pass: { background: "var(--test-pass)", color: "$colors$surface1" },
      fail: { background: "var(--test-fail)", color: "$colors$surface1" },
    },
  },
});

export const passBackgroundClassName = background({ status: "pass" });
export const failBackgroundClassName = background({ status: "fail" });