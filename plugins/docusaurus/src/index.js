/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { validateThemeConfig } = require("./validateThemeConfig");

function theme() {
  return {
    name: "docusaurus-sandpack",

    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },
  };
}

module.exports = theme;

theme.validateThemeConfig = validateThemeConfig;
