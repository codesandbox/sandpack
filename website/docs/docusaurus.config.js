// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "Sandpack",
    tagline: "Bring the power of CodeSandbox into your project",
    url: "https://your-docusaurus-test-site.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",
    organizationName: "codesandbox",
    projectName: "sandpack",

    themes: ["@codesandbox/sandpack-docusaurus"],

    plugins: [
      "docusaurus-plugin-sass",
      [
        "@docusaurus/plugin-sitemap",
        {
          changefreq: "weekly",
          priority: 0.5,
          trailingSlash: false,
          id: "sitemap",
        },
      ],
    ],

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            routeBasePath: "/",
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl:
              "https://github.com/codesandbox/sandpack/edit/main/website/docs",
          },
          blog: {
            blogSidebarTitle: "Latest",
            path: "./releases",
            routeBasePath: "releases",
            showReadingTime: true,
            editUrl:
              "https://github.com/codesandbox/sandpack/edit/main/website/docs",
          },
          theme: {
            customCss: [require.resolve("./src/scss/custom.scss")],
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        sandpack: { theme: require("./src/scss/sandpack-theme") },
        colorMode: {
          defaultMode: "dark",
          disableSwitch: true,
        },
        navbar: {
          title: "Sandpack",
          logo: {
            alt: "Sandpack",
            src: "img/logo-dark.svg",
            srcDark: "img/logo.svg",
          },
          items: [
            { to: "/releases", label: "Releases", position: "right" },
            {
              href: "https://github.com/codesandbox/sandpack",
              label: "GitHub",
              position: "right",
            },
          ],
        },
        footer: {
          style: "dark",
          links: [
            {
              title: "Community",
              items: [
                {
                  label: "Stack Overflow",
                  href: "https://stackoverflow.com/questions/tagged/docusaurus",
                },
                {
                  label: "Discord",
                  href: "https://discordapp.com/invite/docusaurus",
                },
                {
                  label: "Twitter",
                  href: "https://twitter.com/docusaurus",
                },
              ],
            },
            {
              title: "More",
              items: [
                {
                  label: "Releases",
                  to: "/releases",
                },
                {
                  label: "GitHub",
                  href: "https://github.com/codesandbox/sandpack",
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} CodeSandbox, Inc. Built with Docusaurus.`,
        },
      }),
  }
);
