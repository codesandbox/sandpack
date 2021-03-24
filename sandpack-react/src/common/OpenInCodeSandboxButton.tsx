import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { useCodeSandboxLink } from "../hooks/useCodeSandboxLink";
import { useSandpackTheme } from "../hooks/useSandpackTheme";
import { CSBIcon } from "../icons";
import { isDarkColor } from "../utils/stringUtils";

export const OpenInCodeSandboxButton: React.FC = () => {
  const url = useCodeSandboxLink();
  const { theme } = useSandpackTheme();
  const c = useClasser("sp");

  const csbIconClass = isDarkColor(theme.palette.defaultBackground)
    ? "csb-icon-dark"
    : "csb-icon-light";

  return (
    <a
      className={c("button", "icon-standalone", csbIconClass)}
      href={url}
      rel="noreferrer noopener"
      target="_blank"
      title="Open in CodeSandbox"
    >
      <CSBIcon />
    </a>
  );
};
