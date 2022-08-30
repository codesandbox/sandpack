import { useClasser } from "@code-hike/classer";
import * as React from "react";

import { RunIcon } from "../../icons";
import { THEME_PREFIX } from "../../styles";
import {
  roundedButtonClassName,
  buttonClassName,
  iconStandaloneClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

export const RunButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const c = useClasser(THEME_PREFIX);

  return (
    <button
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName
      )}
      onClick={onClick}
      title="Run tests"
      type="button"
    >
      <RunIcon />
    </button>
  );
};
