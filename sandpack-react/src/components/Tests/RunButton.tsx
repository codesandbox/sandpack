import * as React from "react";

import { RunIcon } from "../../icons";
import { actionButtonClassName, buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

export const RunButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={classNames(buttonClassName, actionButtonClassName)}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <RunIcon />
      {children}
    </button>
  );
};
