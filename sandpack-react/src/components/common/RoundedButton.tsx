import { useClasser } from "@code-hike/classer";
import React from "react";

import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { classNames } from "../../utils/classNames";

export const RoundedButton: React.FC<
  React.PropsWithChildren & React.ButtonHTMLAttributes<unknown>
> = ({ onClick, className, children }) => {
  const c = useClasser("sp");

  return (
    <button
      className={classNames(
        c("button", "icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName,
        className
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
