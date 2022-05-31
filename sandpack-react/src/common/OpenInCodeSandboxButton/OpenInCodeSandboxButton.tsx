import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { ExportIcon } from "../../icons";
import { THEME_PREFIX } from "../../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  actionButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

/**
 * @category Components
 */
export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);

  return (
    <UnstyledOpenInCodeSandboxButton
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        actionButtonClassName
      )}
    >
      <ExportIcon />
    </UnstyledOpenInCodeSandboxButton>
  );
};
