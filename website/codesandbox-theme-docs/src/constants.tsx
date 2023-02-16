/* eslint sort-keys: error */
import { useRouter } from "next/router";
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import React, { isValidElement } from "react";

import { Anchor, Flexsearch, Footer, Navbar, TOC } from "./components";
import { MatchSorterSearch } from "./components/match-sorter-search";
import { useConfig } from "./contexts";
import type { DocsThemeConfig, PageTheme } from "./types";
import { getGitEditUrl } from "./utils";

export const DEFAULT_LOCALE = "en-US";

export const IS_BROWSER = typeof window !== "undefined";

export const DEFAULT_THEME: DocsThemeConfig = {
  banner: {
    dismissible: true,
    key: "nextra-banner",
  },
  chat: {
    icon: (
      <>
        <DiscordIcon />
        <span className="nx-sr-only">Discord</span>
      </>
    ),
  },
  darkMode: true,
  direction: "ltr",
  docsRepositoryBase: "https://github.com/shuding/nextra",
  editLink: {
    component({ className, filePath, children }) {
      const editUrl = getGitEditUrl(filePath);
      if (!editUrl) {
        return null;
      }
      return (
        <Anchor className={className} href={editUrl}>
          {children}
        </Anchor>
      );
    },
    text: "Edit this page",
  },
  feedback: {},
  footer: {
    component: Footer,
    text: `MIT ${new Date().getFullYear()} © Nextra.`,
  },
  getNextSeoProps: () => ({ titleTemplate: "%s – Nextra" }),
  gitTimestamp({ timestamp }) {
    const { locale = DEFAULT_LOCALE } = useRouter();
    return (
      <>
        Last updated on{" "}
        {timestamp.toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </>
    );
  },
  head: (
    <>
      <meta content="#fff" name="msapplication-TileColor" />
      <meta content="en" httpEquiv="Content-Language" />
      <meta content="Nextra: the next docs builder" name="description" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@shuding_" name="twitter:site" />
      <meta content="Nextra: the next docs builder" property="og:title" />
      <meta content="Nextra: the next docs builder" property="og:description" />
      <meta content="Nextra" name="apple-mobile-web-app-title" />
    </>
  ),
  i18n: [],
  logo: (
    <>
      <span className="nx-font-extrabold">Nextra</span>
      <span className="nx-ml-2 nx-hidden nx-font-normal nx-text-gray-600 md:nx-inline">
        The Next Docs Builder
      </span>
    </>
  ),
  logoLink: true,
  navbar: Navbar,
  navigation: {
    next: true,
    prev: true,
  },
  nextThemes: {
    defaultTheme: "system",
    storageKey: "theme",
  },
  notFound: {
    content: "Submit an issue about broken link →",
    labels: "bug",
  },
  primaryHue: {
    dark: 204,
    light: 212,
  },
  project: {
    icon: (
      <>
        <GitHubIcon />
        <span className="nx-sr-only">GitHub</span>
      </>
    ),
  },
  search: {
    component({ className, directories }) {
      const config = useConfig();
      return config.unstable_flexsearch ? (
        <Flexsearch className={className} />
      ) : (
        <MatchSorterSearch className={className} directories={directories} />
      );
    },
    emptyResult: (
      <span className="nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
        No results found.
      </span>
    ),
    placeholder() {
      const { locale } = useRouter();
      if (locale === "zh-CN") return "搜索文档…";
      if (locale === "ru-RU") return "Поиск документации…";
      if (locale === "fr-FR") return "Rechercher de la documentation…";
      return "Search documentation…";
    },
  },
  serverSideError: {
    content: "Submit an issue about error in url →",
    labels: "bug",
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => <>{title}</>,
  },
  toc: {
    component: TOC,
    float: true,
    title: "On This Page",
  },
};

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !isValidElement(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean) as Array<keyof DocsThemeConfig>;

export const LEGACY_CONFIG_OPTIONS: Record<string, string> = {
  bannerKey: "banner.key",
  bodyExtraContent: "main",
  customSearch: "search.component",
  defaultMenuCollapsed: "sidebar.defaultMenuCollapseLevel",
  feedbackLabels: "feedback.labels",
  feedbackLink: "feedback.content",
  floatTOC: "toc.float",
  footerEditLink: "editLink.text",
  footerText: "footer.text",
  github: "project.link",
  nextLinks: "navigation.next",
  notFoundLabels: "notFound.labels",
  notFoundLink: "notFound.content",
  prevLinks: "navigation.prev",
  projectChat: "chat",
  projectChatLink: "chat.link",
  projectChatLinkIcon: "chat.icon",
  projectLink: "project.link",
  projectLinkIcon: "project.icon",
  searchPlaceholder: "search.placeholder",
  serverSideErrorLabels: "serverSideError.labels",
  serverSideErrorLink: "serverSideError.content",
  sidebarSubtitle: "sidebar.titleComponent",
  tocExtraContent: "toc.extraContent",
  unstable_searchResultEmpty: "search.emptyResult",
};

export const DEFAULT_PAGE_THEME: PageTheme = {
  breadcrumb: true,
  collapsed: false,
  footer: true,
  layout: "default",
  navbar: true,
  pagination: true,
  sidebar: true,
  timestamp: true,
  toc: true,
  typesetting: "default",
};
