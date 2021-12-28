/* eslint-disable @typescript-eslint/no-var-requires */
const { getSandpackCssText } = require("@codesandbox/sandpack-react");
const path = require("path");
const { validateThemeConfig } = require("./validateThemeConfig");

function theme() {
  return {
    name: "docusaurus-sandpack",

    injectHtmlTags() {
      return {
        tagName: "style",
        attributes: { id: "sandpack" },
        innerHTML: getSandpackCssText(),
      };
    },

    getThemePath() {
      return path.resolve(__dirname, "./theme");
    },
  };
}

module.exports = theme;

theme.validateThemeConfig = validateThemeConfig;
