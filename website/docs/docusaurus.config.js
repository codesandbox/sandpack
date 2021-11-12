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
      /**
       * API Reference
       */
      [
        "docusaurus-plugin-typedoc",
        {
          id: "components",
          entryPoints: ["../../sandpack-react/src/components/index.ts"],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/components",
          indexTitle: "Components",
          readme: "none",
          plugins: ["typedoc-plugin-missing-exports"],
          sidebar: {
            categoryLabel: "Components",
            fullNames: false,
            readmeLabel: "Components",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "presets",
          entryPoints: ["../../sandpack-react/src/presets/index.ts"],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/presets",
          indexTitle: "Presets",
          readme: "none",
          sidebar: {
            categoryLabel: "Presets",
            fullNames: false,
            readmeLabel: "Presets",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "hooks",
          entryPoints: ["../../sandpack-react/src/hooks/index.ts"],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/hooks",
          indexTitle: "Hooks",
          readme: "none",
          sidebar: {
            categoryLabel: "Hooks",
            fullNames: false,
            readmeLabel: "Hooks",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "common",
          entryPoints: ["../../sandpack-react/src/common/index.ts"],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/common",
          indexTitle: "Common",
          readme: "none",
          sidebar: {
            categoryLabel: "Common",
            fullNames: false,
            readmeLabel: "Common",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "types",
          entryPoints: ["../../sandpack-react/src/types.ts"],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/types",
          indexTitle: "Types",
          readme: "none",
          sidebar: {
            categoryLabel: "Types",
            fullNames: false,
            readmeLabel: "Types",
          },
        },
      ],
      /** END */

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
