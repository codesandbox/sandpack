const { runServer } = require("@verdaccio/node-api");

/**
 * Custom configuration
 */
const customScopes = [`@codesandbox/*`];
const registries = {
  npmjs: {
    url: "https://registry.npmjs.org/",
    cache: false,
  },
  github: {
    url: "https://npm.pkg.github.com/",
    cache: false,
    auth: {
      type: "bearer",
      token: process.env.GH_PKG_TOKEN,
    },
  },
};

/**
 * Default configuration
 */
const defaultPermission = {
  access: "$all",
  publish: "$authenticated",
  unpublish: "$authenticated",
};
const defaultConfiguration = {
  config_path: "./config.yaml",
  storage: "./storage",
  uplinks: registries,
  packages: {
    ...customScopes.reduce((acc, scope) => {
      acc[scope] = { ...defaultPermission, proxy: "github npmjs" };
      return acc;
    }, {}),
    "@*/*": { ...defaultPermission, proxy: "npmjs" },
    "**": { ...defaultPermission, proxy: "npmjs" },
  },
  server: { keepAliveTimeout: 60 },
};

(async () => {
  const app = await runServer(defaultConfiguration);
  app.listen(4000, () => {
    console.log("server started");
  });
})();
