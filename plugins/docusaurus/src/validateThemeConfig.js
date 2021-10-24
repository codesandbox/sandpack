const { Joi } = require("@docusaurus/utils-validation");

const DEFAULT_CONFIG = {
  theme: "codesandbox-light",
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const Schema = Joi.object({
  sandpack: Joi.object({
    theme: Joi.string()
      .equal(
        "codesandbox-light",
        "codesandbox-dark",
        "night-owl",
        "aqua-blue",
        "github-light",
        "monokai-pro"
      )
      .default(DEFAULT_CONFIG.theme),
  })
    .label("themeConfig.sandpack")
    .default(DEFAULT_CONFIG),
});
exports.Schema = Schema;

exports.validateThemeConfig = function ({ validate, themeConfig }) {
  return validate(Schema, themeConfig);
};
