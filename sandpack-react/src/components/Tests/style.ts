export const setTestTheme = (isDark: boolean): Record<string, string> => ({
  "--test-pass": isDark ? "#18df16" : "#15c213",
  "--test-fail": isDark ? "#df162b" : "#c21325",
  "--test-skip": isDark ? "#eace2b" : "#c2a813",
  "--test-run": isDark ? "#eace2b" : "#c2a813",
  "--test-title": isDark ? "#3fbabe" : "#256c6f",
});

export const passTextClassName = `color({ status: "pass" })`;
export const failTextClassName = `color({ status: "fail" })`;
export const skipTextClassName = `color({ status: "skip" })`;
export const titleTextClassName = `color({ status: "title" })`;

export const runBackgroundClassName = `background({ status: "run" })`;
export const passBackgroundClassName = `background({ status: "pass" })`;
export const failBackgroundClassName = `background({ status: "fail" })`;
