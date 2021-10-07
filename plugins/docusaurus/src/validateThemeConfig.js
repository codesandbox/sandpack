const {Joi} = require('@docusaurus/utils-validation');

const DEFAULT_CONFIG = {};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

const Schema = Joi.object({});
exports.Schema = Schema;

exports.validateThemeConfig = function ({validate, themeConfig}) {
  return validate(Schema, themeConfig);
};