import { useTheme } from "next-themes";
import { useMounted } from "nextra/hooks";
import { SunIcon, MoonIcon } from "nextra/icons";
import type { ReactElement } from "react";
import React from "react";

import { Select } from "./select";


interface ThemeSwitchProps {
  lite?: boolean;
}

const OPTIONS = [
  { key: "light", name: "Light" },
  { key: "dark", name: "Dark" },
  { key: "system", name: "System" },
];

export function ThemeSwitch({ lite }: ThemeSwitchProps): ReactElement {
  const { setTheme, resolvedTheme, theme = "" } = useTheme();
  const mounted = useMounted();
  const IconToUse = mounted && resolvedTheme === "dark" ? MoonIcon : SunIcon;
  return (
    <div className="nx-relative">
      <Select
        onChange={(option) => {
          setTheme(option.key);
        }}
        options={OPTIONS}
        selected={{
          key: theme,
          name: (
            <div className="nx-flex nx-items-center nx-gap-2 nx-capitalize">
              <IconToUse />
              <span className={lite ? "md:nx-hidden" : ""}>
                {mounted ? theme : "light"}
              </span>
            </div>
          ),
        }}
        title="Change theme"
      />
    </div>
  );
}
