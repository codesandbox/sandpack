// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import cn from "clsx";
import Slugger from "github-slugger";
import { useRouter } from "next/router";
import type { Heading } from "nextra";
import { ArrowRightIcon } from "nextra/icons";
import type { ReactElement } from "react";
import React, { useState, useEffect, useMemo, memo, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";

import { DEFAULT_LOCALE } from "../constants";
import { useConfig, useMenu, useActiveAnchor } from "../contexts";
import type { Item, MenuItem, PageItem } from "../utils";
import { getFSRoute, getHeadingText, renderComponent } from "../utils";

import { Anchor } from "./anchor";
import { Collapse } from "./collapse";
import { LocaleSwitch } from "./locale-switch";
import { ThemeSwitch } from "./theme-switch";

const TreeState: Record<string, boolean> = Object.create(null);

const Folder = memo(FolderImpl);

const classes = {
  link: cn(
    "nx-flex nx-justify-between nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word]",
    "nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border"
  ),
  inactive: cn(
    "nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900",
    "dark:nx-text-neutral-500 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
    "contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50",
    "contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50"
  ),
  active: cn(
    "nx-bg-primary-50 nx-font-bold nx-text-primary-500 dark:nx-bg-primary-500/10",
    "contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500"
  ),
  list: cn("nx-flex nx-flex-col nx-gap-1"),
  border: cn(
    "nx-relative before:nx-absolute before:nx-inset-y-1.5",
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    "ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0"
  ),
};

function FolderImpl({
  item,
  anchors,
}: {
  item: PageItem | MenuItem | Item;
  anchors: string[];
}): ReactElement {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter();
  const routeOriginal = getFSRoute(asPath, locale);
  const [route] = routeOriginal.split("#");
  const active = [route, route + "/"].includes(item.route + "/");
  const activeRouteInside = active || route.startsWith(item.route + "/");
  const folderLevel = (item.route.match(/\//g) || []).length;

  const { setMenu } = useMenu();
  const config = useConfig();
  const { theme } = item as Item;
  const open =
    TreeState[item.route] !== undefined
      ? TreeState[item.route]
      : active ||
        activeRouteInside ||
        (theme && "collapsed" in theme
          ? !theme.collapsed
          : folderLevel <= config.sidebar.defaultMenuCollapseLevel);

  const rerender = useState({})[1];

  useEffect(() => {
    if (activeRouteInside) {
      TreeState[item.route] = true;
    }
  }, [activeRouteInside]);

  if (item.type === "menu") {
    const menu = item as MenuItem;
    const routes = Object.fromEntries(
      (menu.children || []).map((route) => [route.name, route])
    );
    item.children = Object.entries(menu.items || {}).map(([key, item]) => {
      const route = routes[key] || {
        name: key,
        locale: menu.locale,
        route: menu.route + "/" + key,
      };
      return {
        ...route,
        ...item,
      };
    });
  }
  return (
    <li className={cn({ open, active })}>
      <Anchor
        className={cn(
          "nx-items-center nx-justify-between nx-gap-2",
          classes.link,
          active ? classes.active : classes.inactive
        )}
        href={(item as Item).withIndexPage ? item.route : ""}
        onClick={(e) => {
          const clickedToggleIcon = ["svg", "path"].includes(
            (e.target as HTMLElement).tagName.toLowerCase()
          );
          if (clickedToggleIcon) {
            e.preventDefault();
          }
          if ((item as Item).withIndexPage) {
            // If it's focused, we toggle it. Otherwise, always open it.
            if (active || clickedToggleIcon) {
              TreeState[item.route] = !open;
            } else {
              TreeState[item.route] = true;
              setMenu(false);
            }
            rerender({});
            return;
          }
          if (active) return;
          TreeState[item.route] = !open;
          rerender({});
        }}
      >
        {renderComponent(config.sidebar.titleComponent, {
          title: item.title,
          type: item.type,
        })}
        <ArrowRightIcon
          className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"
          pathClassName={cn(
            "nx-origin-center nx-transition-transform rtl:-nx-rotate-180",
            open && "ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]"
          )}
        />
      </Anchor>
      <Collapse className="ltr:nx-pr-0 rtl:nx-pl-0" open={open}>
        {Array.isArray(item.children) ? (
          <Menu
            anchors={anchors}
            base={item.route}
            className={cn(classes.border, "ltr:nx-ml-1 rtl:nx-mr-1")}
            directories={item.children}
          />
        ) : null}
      </Collapse>
    </li>
  );
}

function Separator({ title }: { title: string }): ReactElement {
  const config = useConfig();
  return (
    <li
      className={cn(
        "[word-break:break-word]",
        title
          ? "nx-mt-5 nx-mb-2 nx-px-2 nx-py-1.5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100"
          : "nx-my-4"
      )}
    >
      {title ? (
        renderComponent(config.sidebar.titleComponent, {
          title,
          type: "separator",
        })
      ) : (
        <hr className="nx-mx-2 nx-border-t nx-border-gray-200 dark:nx-border-primary-100/10" />
      )}
    </li>
  );
}

function File({
  item,
  anchors,
}: {
  item: PageItem | Item;
  anchors: string[];
}): ReactElement {
  const { asPath, locale = DEFAULT_LOCALE } = useRouter();
  const route = getFSRoute(asPath, locale);

  // It is possible that the item doesn't have any route - for example an extermal link.
  const active = item.route && [route, route + "/"].includes(item.route + "/");

  const slugger = new Slugger();
  const activeAnchor = useActiveAnchor();
  const { setMenu } = useMenu();
  const config = useConfig();

  if (item.type === "separator") {
    return <Separator title={item.title} />;
  }

  return (
    <li className={cn(classes.list, { active })}>
      <Anchor
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        onClick={() => {
          setMenu(false);
        }}
      >
        {renderComponent(config.sidebar.titleComponent, {
          title: item.title,
          type: item.type,
        })}

        {item.label && (
          <span>
            <span className="nx-bg-black/[.03] dark:nx-bg-gray-50/10 nx-text-xs nx-px-1 nx-py-0.5 nx-rounded nx-whitespace-nowrap">
              {item.label}
            </span>
          </span>
        )}
      </Anchor>

      {active && anchors.length > 0 && (
        <ul
          className={cn(
            classes.list,
            classes.border,
            "ltr:nx-ml-3 rtl:nx-mr-3"
          )}
        >
          {anchors.map((text) => {
            const slug = slugger.slug(text);
            return (
              <li key={slug}>
                <a
                  className={cn(
                    classes.link,
                    'nx-flex nx-gap-2 before:nx-opacity-25 before:nx-content-["#"]',
                    activeAnchor[slug]?.isActive
                      ? classes.active
                      : classes.inactive
                  )}
                  href={`#${slug}`}
                  onClick={() => {
                    setMenu(false);
                  }}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

interface MenuProps {
  directories: PageItem[] | Item[];
  anchors: string[];
  base?: string;
  className?: string;
  onlyCurrentDocs?: boolean;
}

function Menu({
  directories,
  anchors,
  className,
  onlyCurrentDocs,
}: MenuProps): ReactElement {
  return (
    <ul className={cn(classes.list, className)}>
      {directories.map((item) => {
        if (item.type === "separator") {
          return <Separator title={item.title} />;
        }

        return !onlyCurrentDocs || item.isUnderCurrentDocsTree ? (
          item.type === "menu" ||
          (item.children && (item.children.length || !item.withIndexPage)) ? (
            <Folder key={item.name} anchors={anchors} item={item} />
          ) : (
            <File key={item.name} anchors={anchors} item={item} />
          )
        ) : null;
      })}
    </ul>
  );
}

interface SideBarProps {
  docsDirectories: PageItem[];
  flatDirectories: Item[];
  fullDirectories: Item[];
  asPopover?: boolean;
  headings?: Heading[];
  includePlaceholder: boolean;
}

const emptyHeading: any[] = [];

export function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings = emptyHeading,
  includePlaceholder,
}: SideBarProps): ReactElement {
  const config = useConfig();
  const { menu, setMenu } = useMenu();
  const anchors = useMemo(
    () =>
      headings
        .filter((v) => v.children && v.depth === 2 && v.type === "heading")
        .map(getHeadingText)
        .filter(Boolean),
    [headings]
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menu) {
      document.body.classList.add("nx-overflow-hidden", "md:nx-overflow-auto");
    } else {
      document.body.classList.remove(
        "nx-overflow-hidden",
        "md:nx-overflow-auto"
      );
    }
  }, [menu]);

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector("li.active");

    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        scrollIntoView(activeElement, {
          block: "center",
          inline: "center",
          scrollMode: "always",
          boundary: containerRef.current,
        });
      };
      if (menu) {
        // needs for mobile since menu has transition transform
        setTimeout(scroll, 300);
      } else {
        scroll();
      }
    }
  }, [menu]);

  const hasMenu = config.i18n.length > 0 || config.darkMode;

  return (
    <>
      {includePlaceholder && asPopover ? (
        <div className="nx-hidden nx-h-0 nx-w-64 nx-shrink-0 xl:nx-block" />
      ) : null}
      <div
        className={cn(
          "[transition:background-color_1.5s_ease] motion-reduce:nx-transition-none",
          menu
            ? "nx-fixed nx-inset-0 nx-z-10 nx-bg-black/80 dark:nx-bg-black/60"
            : "nx-bg-transparent"
        )}
        onClick={() => setMenu(false)}
      />
      <aside
        ref={containerRef}
        className={cn(
          "nextra-sidebar-container nx-flex nx-flex-col",
          "md:nx-top-16 md:nx-w-64 md:nx-shrink-0 md:nx-transform-none",
          asPopover ? "md:nx-hidden" : "md:nx-sticky md:nx-self-start",
          menu
            ? "[transform:translate3d(0,0,0)]"
            : "[transform:translate3d(0,-100%,0)]"
        )}
      >
        <div
          className={cn(
            "nx-z-[1]", // for bottom box shadow
            "nx-p-4 md:nx-hidden",
            "nx-shadow-[0_2px_14px_6px_#fff] dark:nx-shadow-[0_2px_14px_6px_#111]",
            "contrast-more:nx-shadow-none dark:contrast-more:nx-shadow-none"
          )}
        >
          {renderComponent(config.search.component, {
            directories: flatDirectories,
          })}
        </div>
        <div
          ref={sidebarRef}
          className={cn(
            "nextra-scrollbar nx-overflow-y-auto nx-px-4 nx-pb-4 md:nx-pt-12",
            "nx-grow md:nx-h-[calc(100vh-var(--nextra-navbar-height)-3.75rem)]"
          )}
        >
          <Menu
            anchors={config.toc.float ? [] : anchors}
            // The sidebar menu, shows only the docs directories.
            className="nx-hidden md:nx-flex"
            // When the viewport size is larger than `md`, hide the anchors in
            // the sidebar when `floatTOC` is enabled.
            directories={docsDirectories}
            onlyCurrentDocs
          />
          <Menu
            anchors={anchors}
            // The mobile dropdown menu, shows all the directories.
            className="md:nx-hidden"
            // Always show the anchor links on mobile (`md`).
            directories={fullDirectories}
          />
        </div>

        {hasMenu && (
          <div
            className={cn(
              "nx-relative nx-z-[1]", // for top box nx-shadow
              "nx-mx-4 nx-border-t nx-py-4 nx-shadow-[0_-12px_16px_#fff]",
              "nx-flex nx-items-center nx-gap-2",
              "dark:nx-border-neutral-800 dark:nx-shadow-[0_-12px_16px_#111]",
              "contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-shadow-none"
            )}
          >
            {config.i18n.length > 0 && (
              <LocaleSwitch className="nx-grow" options={config.i18n} />
            )}
            {config.darkMode && <ThemeSwitch lite={config.i18n.length > 0} />}
          </div>
        )}
      </aside>
    </>
  );
}
