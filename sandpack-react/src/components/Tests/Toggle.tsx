import * as React from "react";

import { css } from "../../styles";
import { classNames } from "../../utils/classNames";

interface Props {
  onChange: () => void;
  checked: boolean;
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}

const labelClassName = css({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
});

const childrenClassName = css({
  marginLeft: "8px",
  color: "$colors$hover",
});

export const Toggle: React.FC<Props> = ({
  disabled,
  id,
  checked,
  onChange,
  children,
}) => {
  return (
    <label className={classNames(labelClassName)} htmlFor={id}>
      <input
        checked={checked}
        disabled={disabled}
        id={id}
        onChange={onChange}
        type="checkbox"
        value=""
      />

      <span className={classNames(childrenClassName)}>{children}</span>
    </label>
  );
};
