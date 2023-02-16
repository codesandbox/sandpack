import { Menu, Transition } from "@headlessui/react";
import cn from "clsx";
import { useRouter } from "next/router";
import { ArrowRightIcon } from "nextra/icons";
import { MenuIcon } from "nextra/icons";
import type { ReactElement, ReactNode } from "react";
import React from "react";

import { DEFAULT_LOCALE } from "../constants";
import { useConfig, useMenu } from "../contexts";
import type { Item, PageItem, MenuItem } from "../utils";
import { renderComponent, getFSRoute } from "../utils";

import { Anchor } from "./anchor";

export interface NavBarProps {
  flatDirectories: Item[];
  items: Array<PageItem | MenuItem>;
}

const classes = {
  link: cn(
    "nx-text-sm contrast-more:nx-text-gray-700 contrast-more:dark:nx-text-gray-100"
  ),
  active: cn("nx-subpixel-antialiased contrast-more:nx-font-bold"),
  inactive: cn(
    "nx-text-gray-600 hover:nx-text-gray-800 dark:nx-text-gray-400 dark:hover:nx-text-gray-200"
  ),
};

function NavbarMenu({
  className,
  menu,
  children,
}: {
  className?: string;
  menu: MenuItem;
  children: ReactNode;
}): ReactElement {
  const { items } = menu;
  const routes = Object.fromEntries(
    (menu.children || []).map((route) => [route.name, route])
  );

  return (
    <div className="nx-relative nx-inline-block">
      <Menu>
        <Menu.Button
          className={cn(
            className,
            "-nx-ml-2 nx-hidden nx-items-center nx-whitespace-nowrap nx-rounded nx-p-2 md:nx-inline-flex",
            classes.inactive
          )}
        >
          {children}
        </Menu.Button>
        <Transition
          leave="nx-transition-opacity"
          leaveFrom="nx-opacity-100"
          leaveTo="nx-opacity-0"
        >
          <Menu.Items className="nx-absolute nx-right-0 nx-z-20 nx-mt-1 nx-max-h-64 nx-min-w-full nx-overflow-auto nx-rounded-md nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-bg-neutral-800">
            {Object.entries(items || {}).map(([key, item]) => (
              <Menu.Item key={key}>
                <Anchor
                  className={cn(
                    "nx-relative nx-hidden nx-w-full nx-select-none nx-whitespace-nowrap nx-text-gray-600 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 md:nx-inline-block",
                    "nx-py-1.5 ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9"
                  )}
                  href={
                    item.href || routes[key]?.route || menu.route + "/" + key
                  }
                  newWindow={item.newWindow}
                >
                  {item.title || key}
                </Anchor>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

export function Navbar({ flatDirectories, items }: NavBarProps): ReactElement {
  const config = useConfig();
  const { locale = DEFAULT_LOCALE, asPath } = useRouter();
  const activeRoute = getFSRoute(asPath, locale);
  const { menu, setMenu } = useMenu();

  return (
    <div className="nextra-nav-container nx-sticky nx-top-0 nx-z-20 nx-w-full nx-bg-transparent">
      <div
        className={cn(
          "nextra-nav-container-blur",
          "nx-pointer-events-none nx-absolute nx-z-[-1] nx-h-full nx-w-full nx-bg-white dark:nx-bg-dark",
          "nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_-1px_0_rgba(0,0,0,.06)_inset] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]",
          "contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff]"
        )}
      />
      <nav className="nx-mx-auto nx-flex nx-h-[var(--nextra-navbar-height)] nx-max-w-[90rem] nx-items-center nx-justify-end nx-gap-2 nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]">
        {config.logoLink ? (
          <Anchor
            className="nx-flex nx-items-center hover:nx-opacity-75 ltr:nx-mr-auto rtl:nx-ml-auto md:nx-w-64"
            href={typeof config.logoLink === "string" ? config.logoLink : "/"}
          >
            {renderComponent(config.logo)}
          </Anchor>
        ) : (
          <div className="nx-flex nx-items-center ltr:nx-mr-auto rtl:nx-ml-auto">
            {renderComponent(config.logo)}
          </div>
        )}

        <div className="cbs-menu-container ">
          <div className="cbs-menu">
            {items.map((pageOrMenu) => {
              if (pageOrMenu.display === "hidden") return null;

              if (pageOrMenu.type === "menu") {
                const menu = pageOrMenu as MenuItem;

                const isActive =
                  menu.route === activeRoute ||
                  activeRoute.startsWith(menu.route + "/");

                return (
                  <NavbarMenu
                    key={menu.title}
                    className={cn(
                      classes.link,
                      "nx-flex nx-gap-1",
                      isActive ? classes.active : classes.inactive
                    )}
                    menu={menu}
                  >
                    {menu.title}
                    <ArrowRightIcon
                      className="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5"
                      pathClassName="nx-origin-center nx-transition-transform nx-rotate-90"
                    />
                  </NavbarMenu>
                );
              }
              const page = pageOrMenu as PageItem;
              let href = page.href || page.route || "#";

              // If it's a directory
              if (page.children) {
                href =
                  (page.withIndexPage ? page.route : page.firstChildRoute) ||
                  href;
              }

              const isActive =
                page.route === activeRoute ||
                activeRoute.startsWith(page.route + "/");

              return (
                <Anchor
                  key={page.route}
                  aria-current={!page.newWindow && isActive}
                  className={cn(
                    classes.link,
                    "-nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block",
                    !isActive || page.newWindow
                      ? classes.inactive
                      : classes.active
                  )}
                  href={href}
                  newWindow={page.newWindow}
                >
                  {page.title}
                </Anchor>
              );
            })}
          </div>

          {renderComponent(config.search.component, {
            directories: flatDirectories,
            className: "nx-hidden md:nx-inline-block mx-min-w-[200px]",
          })}
        </div>

        {config.project.link ? (
          <Anchor
            className="nx-p-2 nx-text-current"
            href={config.project.link}
            newWindow
          >
            {renderComponent(config.project.icon)}
          </Anchor>
        ) : config.project.icon ? (
          // if no project link is provided, but a component exists, render it
          // to allow the client to render their own link
          renderComponent(config.project.icon)
        ) : null}

        {config.chat.link ? (
          <Anchor
            className="nx-p-2 nx-text-current"
            href={config.chat.link}
            newWindow
          >
            {renderComponent(config.chat.icon)}
          </Anchor>
        ) : config.chat.icon ? (
          // if no chat link is provided, but a component exists, render it
          // to allow the client to render their own link
          renderComponent(config.chat.icon)
        ) : null}

        <button
          aria-label="Menu"
          className="nextra-hamburger -nx-mr-2 nx-rounded nx-p-2 active:nx-bg-gray-400/20 md:nx-hidden"
          onClick={() => setMenu(!menu)}
          type="button"
        >
          <MenuIcon className={cn({ open: menu })} />
        </button>
      </nav>
    </div>
  );
}
