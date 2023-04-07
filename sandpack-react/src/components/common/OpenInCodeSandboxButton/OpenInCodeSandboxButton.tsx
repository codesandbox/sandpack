import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../../styles/shared";
import { useClassNames } from "../../../utils/classNames";
import { ExportIcon } from "../../icons";

import { UnstyledOpenInCodeSandboxButton } from "./UnstyledOpenInCodeSandboxButton";

export const OpenInCodeSandboxButton = (): JSX.Element | null => {
  const classNames = useClassNames();

  return (
    <UnstyledOpenInCodeSandboxButton
      className={classNames("button", [
        classNames("icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName,
      ])}
    >
      <ExportIcon />
      <span>Open Sandbox</span>
    </UnstyledOpenInCodeSandboxButton>
  );
};
