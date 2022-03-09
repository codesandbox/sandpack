import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { CSBIcon } from "../../icons";
import { isDarkColor } from "../../utils/stringUtils";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

/**
 * @category Components
 */
export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const c = useClasser("sp");

  return (
    <UnstyledOpenInCodeSandboxButton className={c("button", "icon-standalone")}>
      <CSBIcon />
    </UnstyledOpenInCodeSandboxButton>
  );
};
