import { css } from "../../styles";

export const setTestTheme = (isDark: boolean): Record<string, string> => ({
  "--test-pass": isDark ? "#18df16" : "#15c213",
  "--test-fail": isDark ? "#df162b" : "#c21325",
  "--test-skip": isDark ? "#eace2b" : "#c2a813",
  "--test-run": isDark ? "#eace2b" : "#c2a813",
  "--test-title": isDark ? "#3fbabe" : "#256c6f",
});

const color = css({
  variants: {
    status: {
      pass: { color: "var(--test-pass)" },
      fail: { color: "var(--test-fail)" },
      skip: { color: "var(--test-skip)" },
      title: { color: "var(--test-title)" },
    },
  },
});

export const passTextClassName = color({ status: "pass" });
export const failTextClassName = color({ status: "fail" });
export const skipTextClassName = color({ status: "skip" });
export const titleTextClassName = color({ status: "title" });

const background = css({
  variants: {
    status: {
      pass: { background: "var(--test-pass)", color: "$colors$surface1" },
      fail: { background: "var(--test-fail)", color: "$colors$surface1" },
      run: { background: "var(--test-run)", color: "$colors$surface1" },
    },
  },
});

export const runBackgroundClassName = background({ status: "run" });
export const passBackgroundClassName = background({ status: "pass" });
export const failBackgroundClassName = background({ status: "fail" });
