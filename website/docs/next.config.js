const withNextra = require("nextra")({
  theme: "codesandbox-theme-docs",
  themeConfig: "./theme.config.js",
  unstable_flexsearch: true,
  unstable_staticImage: true,
  images: {
    quality: 90,
  },
});

module.exports = withNextra({
  basePath: "/docs",
  redirects() {
    return [
      {
        source: "/getting-started/install",
        destination: "/getting-started",
        permanent: true,
      },
      {
        source: "/getting-started/custom-content",
        destination: "/getting-started",
        permanent: true,
      },
      {
        source: "/getting-started/custom-ui",
        destination: "/getting-started/layout",
        permanent: true,
      },
      {
        source: "/getting-started/custom-ui",
        destination: "/getting-started/layout",
        permanent: true,
      },
      {
        source: "/getting-started/ssr",
        destination: "/guides/ssr",
        permanent: true,
      },
      {
        source: "/advanced-usage/provider",
        destination: "/advanced-usage",
        permanent: true,
      },
      {
        source: "/api/:path*",
        destination: "/advanced-usage",
        permanent: true,
      },
    ];
  },
});
