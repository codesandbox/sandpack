import { useRouter } from "next/router";
import { GlobeIcon } from "nextra/icons";
import type { ReactElement } from "react";
import React from "react";

import type { DocsThemeConfig } from "../types";

import { Select } from "./select";


interface LocaleSwitchProps {
  options: NonNullable<DocsThemeConfig["i18n"]>;
  lite?: boolean;
  className?: string;
}

export function LocaleSwitch({
  options,
  lite,
  className,
}: LocaleSwitchProps): ReactElement {
  const { locale, asPath } = useRouter();
  const selected = options.find((l) => locale === l.locale);
  return (
    <Select
      className={className}
      onChange={(option) => {
        const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`;
        location.href = asPath;
      }}
      options={options.map((l) => ({
        key: l.locale,
        name: l.text,
      }))}
      selected={{
        key: selected?.locale || "",
        name: (
          <div className="nx-flex nx-items-center nx-gap-2">
            <GlobeIcon />
            <span className={lite ? "nx-hidden" : ""}>{selected?.text}</span>
          </div>
        ),
      }}
      title="Change language"
    />
  );
}
