const typeDocsDefault = {
  readme: "none",
  plugin: ["typedoc-plugin-no-inherit"],
};

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Sandpack",
  tagline: "Bring the power of CodeSandbox into your project",
  url: "https://sandpack.vercel.app",
  baseUrl: "/docs/",
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
        ...typeDocsDefault,
        id: "components",
        entryPoints: ["../../sandpack-react/src/_docs-index/components.ts"],
        tsconfig: "../../sandpack-react/tsconfig.json",
        out: "api/react/components",
        indexTitle: "Components",
        sidebar: {
          categoryLabel: "Components",
          fullNames: false,
          readmeLabel: "Components",
          position: 0,
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typeDocsDefault,
        id: "provider",
        entryPoints: ["../../sandpack-react/src/_docs-index/provider.ts"],
        tsconfig: "../../sandpack-react/tsconfig.json",
        out: "api/react/provider",
        indexTitle: "Provider",
        sidebar: {
          categoryLabel: "Provider",
          fullNames: false,
          readmeLabel: "Provider",
          position: 1,
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typeDocsDefault,
        id: "hooks",
        entryPoints: ["../../sandpack-react/src/_docs-index/hooks.ts"],
        tsconfig: "../../sandpack-react/tsconfig.json",
        out: "api/react/hooks",
        indexTitle: "Hooks",
        sidebar: {
          categoryLabel: "Hooks",
          fullNames: false,
          readmeLabel: "Hooks",
          position: 2,
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typeDocsDefault,
        id: "Theme",
        entryPoints: ["../../sandpack-react/src/_docs-index/theme.ts"],
        tsconfig: "../../sandpack-react/tsconfig.json",
        out: "api/react/theme",
        indexTitle: "Theme",
        sidebar: {
          categoryLabel: "Theme",
          readmeLabel: "Theme",
          position: 3,
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        ...typeDocsDefault,
        id: "client",
        entryPoints: ["../../sandpack-client/src/index.ts"],
        tsconfig: "../../sandpack-client/tsconfig.json",
        out: "api/client",
        indexTitle: "Sandpack-client",
        sidebar: {
          categoryLabel: "Sandpack-client",
          readmeLabel: "Sandpack-client",
          position: 4,
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
};
