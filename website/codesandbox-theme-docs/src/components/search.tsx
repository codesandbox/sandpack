import { Transition } from "@headlessui/react";
import cn from "clsx";
import { useRouter } from "next/router";
import { useMounted } from "nextra/hooks";
import { SpinnerIcon } from "nextra/icons";
import React, {
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import type { ReactElement, KeyboardEvent } from "react";

import { useConfig, useMenu } from "../contexts";
import type { SearchResult } from "../types";
import { renderComponent, renderString } from "../utils";

import { Anchor } from "./anchor";
import { Input } from "./input";

interface SearchProps {
  className?: string;
  overlayClassName?: string;
  value: string;
  onChange: (newValue: string) => void;
  onActive?: (active: boolean) => void;
  loading?: boolean;
  results: SearchResult[];
}

const INPUTS = ["input", "select", "button", "textarea"];

export function Search({
  className,
  overlayClassName,
  value,
  onChange,
  onActive,
  loading,
  results,
}: SearchProps): ReactElement {
  const [show, setShow] = useState(false);
  const config = useConfig();
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { setMenu } = useMenu();
  const input = useRef<HTMLInputElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setActive(0);
  }, [value]);

  useEffect(() => {
    onActive && onActive(show);
  }, [show]);

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent): void => {
      const tagName = document.activeElement?.tagName.toLowerCase();
      if (!input.current || !tagName || INPUTS.includes(tagName)) return;
      if (
        e.key === "k" &&
        (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey)
      ) {
        e.preventDefault();
        input.current.focus();
      } else if (e.key === "Escape") {
        setShow(false);
        input.current.blur();
      }
    };

    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  const handleKeyDown = useCallback(
    function <T>(e: KeyboardEvent<T>) {
      switch (e.key) {
        case "ArrowDown": {
          if (active + 1 < results.length) {
            const el = ulRef.current?.querySelector<HTMLAnchorElement>(
              `li:nth-of-type(${active + 2}) > a`
            );
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "ArrowUp": {
          if (active - 1 >= 0) {
            const el = ulRef.current?.querySelector<HTMLAnchorElement>(
              `li:nth-of-type(${active}) > a`
            );
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "Enter": {
          const result = results[active];
          if (result) {
            router.push(result.route);
            finishSearch();
          }
          break;
        }
        case "Escape": {
          setShow(false);
          input.current?.blur();
          break;
        }
      }
    },
    [active, results, router]
  );

  const finishSearch = () => {
    input.current?.blur();
    onChange("");
    setShow(false);
    setMenu(false);
  };

  const mounted = useMounted();
  const renderList = show && Boolean(value);

  const icon = (
    <Transition
      as={React.Fragment}
      enter="nx-transition-opacity"
      enterFrom="nx-opacity-0"
      enterTo="nx-opacity-100"
      leave="nx-transition-opacity"
      leaveFrom="nx-opacity-100"
      leaveTo="nx-opacity-0"
      show={mounted && (!show || Boolean(value))}
    >
      <kbd
        className={cn(
          "nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5",
          "nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500",
          "nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50",
          "contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current",
          "nx-items-center nx-gap-1 nx-transition-opacity",
          value
            ? "nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70"
            : "nx-pointer-events-none nx-hidden sm:nx-flex"
        )}
        onClick={() => {
          onChange("");
        }}
        title={value ? "Clear" : undefined}
      >
        {value
          ? "ESC"
          : mounted &&
            (navigator.userAgent.includes("Macintosh") ? (
              <>
                <span className="nx-text-xs">⌘</span>K
              </>
            ) : (
              "CTRL K"
            ))}
      </kbd>
    </Transition>
  );

  const handleActive = useCallback(
    (e: { currentTarget: { dataset: DOMStringMap } }) => {
      const { index } = e.currentTarget.dataset;
      setActive(Number(index));
    },
    []
  );

  return (
    <>
      <div />
      <div className={cn("nextra-search nx-relative", className)}>
        {renderList && (
          <div
            className="nx-fixed nx-inset-0 nx-z-10"
            onClick={() => setShow(false)}
          />
        )}

        <Input
          ref={input}
          onChange={(e) => {
            const { value } = e.target;
            onChange(value);
            setShow(Boolean(value));
          }}
          onKeyDown={handleKeyDown}
          placeholder={renderString(config.search.placeholder)}
          suffix={icon}
          type="search"
          value={value}
        />

        <Transition
          as={Transition.Child}
          // Transition.Child is required here, otherwise popup will be still present in DOM after focus out
          leave="nx-transition-opacity nx-duration-100"
          leaveFrom="nx-opacity-100"
          leaveTo="nx-opacity-0"
          show={renderList}
        >
          <ul
            ref={ulRef}
            className={cn(
              "nextra-scrollbar",
              // Using bg-white as background-color when the browser didn't support backdrop-filter
              "nx-bg-white nx-text-gray-100 dark:nx-bg-neutral-900",
              "nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl",
              "nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]",
              "md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]",
              "nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto",
              "contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50",
              overlayClassName
            )}
            style={{
              transition: "max-height .2s ease", // don't work with tailwindcss
            }}
          >
            {loading ? (
              <span className="nx-flex nx-select-none nx-justify-center nx-gap-2 nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
                <SpinnerIcon className="nx-h-5 nx-w-5 nx-animate-spin" />
                Loading...
              </span>
            ) : results.length > 0 ? (
              results.map(({ route, prefix, children, id }, i) => (
                <Fragment key={id}>
                  {prefix}
                  <li
                    className={cn(
                      "nx-mx-2.5 nx-break-words nx-rounded-md",
                      "contrast-more:nx-border",
                      i === active
                        ? "nx-bg-primary-500/10 nx-text-primary-500 contrast-more:nx-border-primary-500"
                        : "nx-text-gray-800 contrast-more:nx-border-transparent dark:nx-text-gray-300"
                    )}
                  >
                    <Anchor
                      className="nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2"
                      data-index={i}
                      href={route}
                      onClick={finishSearch}
                      onFocus={handleActive}
                      onKeyDown={handleKeyDown}
                      onMouseMove={handleActive}
                    >
                      {children}
                    </Anchor>
                  </li>
                </Fragment>
              ))
            ) : (
              renderComponent(config.search.emptyResult)
            )}
          </ul>
        </Transition>
      </div>
    </>
  );
}
