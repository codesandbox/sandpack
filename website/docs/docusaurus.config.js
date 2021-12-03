const BASE_URL = process.env.BASE_URL || "/";
const API_KEY = process.env.AMPLITUDE_API_KEY;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Sandpack",
  tagline: "Bring the power of CodeSandbox into your project",
  url: `https://sandpack.vercel.app/`,
  baseUrl: BASE_URL,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "codesandbox",
  projectName: "sandpack",
  themes: ["@codesandbox/sandpack-docusaurus"],

  plugins: [
    function pluginAmplitude() {
      return {
        name: "docusaurus-plugin-amplitude",

        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: "script",
                innerHTML: API_KEY
                  ? `
                (function(e,t){var r=e.amplitude||{_q:[],_iq:{}};var n=t.createElement("script")
                ;n.type="text/javascript"
                ;n.integrity="sha384-4rr7CTymHc64YjTTL6O3ktfsHYI1yJnQdmKv4zFoe+frjXb05MfzzuLLIAgJ/XHs"
                ;n.crossOrigin="anonymous";n.async=true
                ;n.src="https://cdn.amplitude.com/libs/amplitude-8.11.0-min.gz.js"
                ;n.onload=function(){if(!e.amplitude.runQueuedFunctions){
                console.log("[Amplitude] Error: could not load SDK")}}
                ;var s=t.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s)
                ;function i(e,t){e.prototype[t]=function(){
                this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
                var o=function(){this._q=[];return this}
                ;var a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove"]
                ;for(var c=0;c<a.length;c++){i(o,a[c])}r.Identify=o;var u=function(){this._q=[]
                ;return this}
                ;var p=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
                ;for(var l=0;l<p.length;l++){i(u,p[l])}r.Revenue=u
                ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId","setLibrary","setTransport"]
                ;function v(e){function t(t){e[t]=function(){
                e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
                for(var r=0;r<d.length;r++){t(d[r])}}v(r);r.getInstance=function(e){
                e=(!e||e.length===0?"$default_instance":e).toLowerCase()
                ;if(!Object.prototype.hasOwnProperty.call(r._iq,e)){r._iq[e]={_q:[]};v(r._iq[e])
                }return r._iq[e]};e.amplitude=r})(window,document);
                
                amplitude.getInstance().init("${API_KEY}");

                setTimeout(() => {
                  amplitude.logEvent("pageview", { path: window.location.href, source: "sandpack-docs" });
                }, 300)
                `
                  : "",
              },
            ],
          };
        },
      };
    },

    /**
     * API Reference
     */
    [
      "docusaurus-plugin-typedoc",
      {
        id: "react",
        readme: "none",
        plugin: ["typedoc-plugin-no-inherit"],
        entryPoints: ["../../sandpack-react/src/index.ts"],
        tsconfig: "../../sandpack-react/tsconfig.json",
        out: "api/react",
        indexTitle: "Sandpack React",
        exclude: "**/{node_modules,test}/**/*",
        sidebar: {
          categoryLabel: "Sandpack React",
          fullNames: false,
          readmeLabel: "Sandpack React",
          position: 0,
        },
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        id: "client",
        readme: "none",
        plugin: ["typedoc-plugin-no-inherit"],
        entryPoints: ["../../sandpack-client/src/index.ts"],
        tsconfig: "../../sandpack-client/tsconfig.json",
        out: "api/client",
        indexTitle: "Sandpack client",
        sidebar: {
          categoryLabel: "Sandpack client",
          readmeLabel: "Sandpack client",
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
          sidebarCollapsed: false,

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
      sandpack: { theme: "sandpack-dark" },
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
