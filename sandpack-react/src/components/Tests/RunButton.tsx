import * as React from "react";

import { RunIcon } from "../../icons";
import { css } from "../../styles";
import { actionButtonClassName, buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

const runButtonClassName = css({
  fontSize: "12px",
  paddingRight: "12px",
});

export const RunButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={classNames(
        buttonClassName,
        actionButtonClassName,
        runButtonClassName
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <RunIcon />
      {children}
    </button>
  );
};
