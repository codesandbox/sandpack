import React from "react";

import {
  buttonClassName,
  iconStandaloneClassName,
  roundedButtonClassName,
} from "../../styles/shared";
import { useClassNames } from "../../utils/classNames";

export const RoundedButton: React.FC<
  React.PropsWithChildren & React.ButtonHTMLAttributes<unknown>
> = ({ onClick, className, children }) => {
  const classNames = useClassNames();

  return (
    <button
      className={classNames("button", [
        classNames("icon-standalone"),
        buttonClassName,
        iconStandaloneClassName,
        roundedButtonClassName,
        className,
      ])}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
