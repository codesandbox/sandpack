import { useClasser } from "@code-hike/classer";
import React from "react";

import { useSandpackTheme } from "../..";
import { CleanIcon } from "../../icons";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

export const Button: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const c = useClasser("sp");
  const { css } = useSandpackTheme();

  return (
    <button
      className={classNames(
        c("button", "icon-standalone"),
        css(buttonClassName),
        css(iconStandaloneClassName),
        css(roundedButtonClassName),
        css({
          position: "absolute",
          bottom: "$space$2",
          right: "$space$2",
        })
      )}
      onClick={onClick}
    >
      <CleanIcon />
    </button>
  );
};
