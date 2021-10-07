function theme() {
  return {
    name: 'docusaurus-sandpack',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    }
  };
}

module.exports = theme;