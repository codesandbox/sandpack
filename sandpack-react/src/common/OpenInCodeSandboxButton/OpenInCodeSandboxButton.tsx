import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ExportIcon } from "../../icons";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

/**
 * @category Components
 */
export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const c = useClasser("sp");

  return (
    <UnstyledOpenInCodeSandboxButton className={c("button", "icon-standalone")}>
      <ExportIcon />
    </UnstyledOpenInCodeSandboxButton>
  );
};
