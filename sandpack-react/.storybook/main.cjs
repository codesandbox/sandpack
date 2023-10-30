const { dirname, join } = require("path");
const { mergeConfig } = require("vite");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  docs: {
    autodocs: true,
  },

  features: {
    storyStoreV7: false, // 👈 Opt out of on-demand story loading
  },

  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      define: {
        "process.env.SANDPACK_UNSTYLED_COMPONENTS": "false",
      },
    });
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
