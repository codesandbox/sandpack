import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useSandpackTheme } from "../../hooks/useSandpackTheme";
import { CSBIcon } from "../../icons";
import { THEME_PREFIX } from "../../styles";
import { buttonClassName, iconStandaloneClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { isDarkColor } from "../../utils/stringUtils";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

/**
 * @category Components
 */
export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const { theme } = useSandpackTheme();
  const c = useClasser(THEME_PREFIX);

  const csbIconClass = isDarkColor(theme.colors.surface1)
    ? "csb-icon-dark"
    : "csb-icon-light";

  return (
    <UnstyledOpenInCodeSandboxButton
      className={classNames(
        c("button", "icon-standalone", csbIconClass),
        buttonClassName,
        iconStandaloneClassName
      )}
    >
      <CSBIcon />
    </UnstyledOpenInCodeSandboxButton>
  );
};
