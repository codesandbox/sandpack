export const setTestTheme = (isDark: boolean): Record<string, string> => ({
  "--test-pass": isDark ? "#18df16" : "#15c213",
  "--test-fail": isDark ? "#df162b" : "#c21325",
  "--test-skip": isDark ? "#eace2b" : "#c2a813",
  "--test-run": isDark ? "#eace2b" : "#c2a813",
  "--test-title": isDark ? "#3fbabe" : "#256c6f",
});
