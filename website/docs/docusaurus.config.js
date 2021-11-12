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
          watch: true,
          entryPoints: [
            "../../sandpack-react/src/components/index.ts",
            "../../sandpack-react/src/common/index.ts",
            "../../sandpack-react/src/presets/index.ts",
            "../../sandpack-react/src/types.ts",
          ],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/components",
          indexTitle: "Components",
          readme: "none",
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
          id: "provider",
          watch: true,
          entryPoints: [
            "../../sandpack-react/src/contexts/sandpackContext.tsx",
          ],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/provider",
          indexTitle: "Provider",
          readme: "none",
          sidebar: {
            categoryLabel: "Provider",
            fullNames: false,
            readmeLabel: "Provider",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "hooks",
          watch: true,
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
          id: "Theme",
          watch: true,
          entryPoints: [
            "../../sandpack-react/src/themes/index.ts",
            "../../sandpack-react/src/contexts/themeContext.tsx",
          ],
          tsconfig: "../../sandpack-react/tsconfig.json",
          out: "api/theme",
          indexTitle: "Theme",
          readme: "none",
          sidebar: {
            categoryLabel: "Theme",
            fullNames: false,
            readmeLabel: "Theme",
          },
        },
      ],
      [
        "docusaurus-plugin-typedoc",
        {
          id: "client",
          watch: true,
          entryPoints: ["../../sandpack-client/src/index.ts"],
          tsconfig: "../../sandpack-client/tsconfig.json",
          out: "api/client",
          indexTitle: "Sandpack-client",
          readme: "none",
          sidebar: {
            categoryLabel: "Sandpack-client",
            fullNames: false,
            readmeLabel: "Sandpack-client",
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
