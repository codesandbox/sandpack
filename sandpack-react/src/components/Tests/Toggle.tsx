import * as React from "react";

interface Props {
  onChange: () => void;
  checked: boolean;
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}

export const Toggle: React.FC<Props> = ({
  disabled,
  id,
  checked,
  onChange,
  children,
}) => {
  return (
    <label
      className="inline-flex relative items-center cursor-pointer"
      htmlFor={id}
    >
      <input
        checked={checked}
        className="sr-only peer"
        disabled={disabled}
        id={id}
        onChange={onChange}
        type="checkbox"
        value=""
      />
      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
      <span className="ml-2 text-white">{children}</span>
    </label>
  );
};
