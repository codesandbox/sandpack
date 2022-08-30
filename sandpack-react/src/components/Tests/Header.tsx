import * as React from "react";

import { ConsoleIcon } from "../..";
import { css } from "../../styles";
import { roundedButtonClassName, buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

import type { Status } from "./SandpackTests";

const wrapperClassName = css({
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  padding: "$space$3 $space$2",
  fontFamily: "$font$mono",
  maxHeight: "$layout$headerHeight",
  overflowX: "auto",
  whiteSpace: "nowrap",
});

const flexClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "$space$2",
});

interface Props {
  setVerbose: () => void;
  setSuiteOnly: () => void;
  verbose: boolean;
  suiteOnly: boolean;
  status: Status;
  watchMode: boolean;
  setWatchMode: () => void;
  showSuitesOnly: boolean;
}

export const Header: React.FC<Props> = ({
  status,
  suiteOnly,
  setSuiteOnly,
  setVerbose,
  verbose,
  watchMode,
  setWatchMode,
  showSuitesOnly,
}) => {
  const buttonsClassName = classNames(
    buttonClassName,
    roundedButtonClassName,
    css({ padding: "$space$1 $space$3" })
  );

  return (
    <div className={classNames(wrapperClassName, flexClassName)}>
      <div className={classNames(flexClassName)}>
        <p
          className={classNames(
            css({
              lineHeight: 1,
              margin: 0,
              color: "$colors$base",
              fontSize: "$font$size",

              display: "flex",
              alignItems: "center",

              gap: "$space$2",
            })
          )}
        >
          <ConsoleIcon />
          Tests
        </p>
      </div>

      <div className={classNames(flexClassName)}>
        {showSuitesOnly && (
          <button
            className={buttonsClassName}
            data-active={suiteOnly}
            disabled={status === "initialising"}
            onClick={setSuiteOnly}
          >
            Suite only
          </button>
        )}
        <button
          className={buttonsClassName}
          data-active={verbose}
          disabled={status === "initialising"}
          onClick={setVerbose}
        >
          Verbose
        </button>
        <button
          className={buttonsClassName}
          data-active={watchMode}
          disabled={status === "initialising"}
          onClick={setWatchMode}
        >
          Watch
        </button>
      </div>
    </div>
  );
};
