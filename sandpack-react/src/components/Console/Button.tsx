import { useClasser } from "@code-hike/classer";
import React from "react";

import { CleanIcon } from "../../icons";
import { css } from "../../styles";
import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

export const Button: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const c = useClasser("sp");

  return (
    <button
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName,
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
