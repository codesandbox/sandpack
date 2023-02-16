/* eslint typescript-sort-keys/interface: error */
import type { NextSeoProps } from "next-seo";
import type { ThemeProviderProps } from "next-themes/dist/types";
import type { PageOpts } from "nextra";
import type { FC, ReactNode } from "react";

import type { NavBarProps } from "./components/navbar";
import type { TOCProps } from "./components/toc";
import type { Item } from "./utils";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[P] extends FC // do not change properties for optional in FC type
    ? T[P]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

export interface DocsThemeConfig {
  banner: {
    dismissible: boolean;
    key: string;
    text?: ReactNode | FC;
  };
  chat: {
    icon: ReactNode | FC;
    link?: string;
  };
  components?: Record<string, FC>;
  darkMode: boolean;
  direction: "ltr" | "rtl";
  docsRepositoryBase: string;
  editLink: {
    component: FC<{
      children: ReactNode;
      className?: string;
      filePath?: string;
    }>;
    text: ReactNode | FC;
  };
  faviconGlyph?: string;
  feedback: {
    content?: ReactNode | FC;
    labels?: string;
  };
  footer: {
    component: ReactNode | FC<{ menu: boolean }>;
    text: ReactNode | FC;
  };
  getNextSeoProps?: () => NextSeoProps;
  gitTimestamp: ReactNode | FC<{ timestamp: Date }>;
  head: ReactNode | FC;
  i18n: Array<{ direction?: string; locale: string; text: string }>;
  logo: ReactNode | FC;
  logoLink?: boolean | string;
  main?: FC<{ children: ReactNode }>;
  navbar: ReactNode | FC<NavBarProps>;
  navigation:
    | boolean
    | {
        next: boolean;
        prev: boolean;
      };
  nextThemes: Pick<
    ThemeProviderProps,
    "defaultTheme" | "storageKey" | "forcedTheme"
  >;
  notFound: {
    content: ReactNode | FC;
    labels: string;
  };
  primaryHue:
    | number
    | {
        dark: number;
        light: number;
      };
  project: {
    icon: ReactNode | FC;
    link?: string;
  };
  search: {
    component:
      | ReactNode
      | FC<{
          className?: string;
          directories: Item[];
        }>;
    emptyResult: ReactNode | FC;
    // Can't be React component
    placeholder: string | (() => string);
  };
  serverSideError: {
    content: ReactNode | FC;
    labels: string;
  };
  sidebar: {
    defaultMenuCollapseLevel: number;
    titleComponent: ReactNode | FC<{ title: string; type: string }>;
  };
  toc: {
    component: ReactNode | FC<TOCProps>;
    extraContent?: ReactNode | FC;
    float: boolean;
    title: ReactNode | FC;
  };
}

export interface PageTheme {
  breadcrumb: boolean;
  collapsed: boolean;
  footer: boolean;
  layout: "default" | "full" | "raw";
  navbar: boolean;
  pagination: boolean;
  sidebar: boolean;
  timestamp: boolean;
  toc: boolean;
  typesetting: "default" | "article";
}

export interface Context {
  Content: FC;
  pageOpts: PageOpts;
  themeConfig: DocsThemeConfig;
}

export interface SearchResult {
  children: ReactNode;
  id: string;
  prefix?: ReactNode;
  route: string;
}
