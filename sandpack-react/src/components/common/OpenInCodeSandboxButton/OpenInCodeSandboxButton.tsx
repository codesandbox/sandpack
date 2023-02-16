import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { THEME_PREFIX } from "../../../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../../styles/shared";
import { classNames } from "../../../utils/classNames";
import { ExportIcon } from "../../icons";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const c = useClasser(THEME_PREFIX);

  return (
    <UnstyledOpenInCodeSandboxButton
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName
      )}
    >
      <ExportIcon />
    </UnstyledOpenInCodeSandboxButton>
  );
};
