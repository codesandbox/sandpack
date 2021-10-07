const {validateThemeConfig} = require('./validateThemeConfig');

function theme() {
  return {
    name: 'docusaurus-sandpack',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    }
  };
}

console.log("plugin")

module.exports = theme;

theme.validateThemeConfig = validateThemeConfig;