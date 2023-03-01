import * as React from "react";

import { css } from "../../styles";
import { buttonClassName, roundedButtonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";
import { ConsoleIcon } from "../icons";

import type { Status } from "./SandpackTests";

const wrapperClassName = css({
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  padding: "0 $space$2",
  fontFamily: "$font$mono",
  height: "$layout$headerHeight",
  minHeight: "$layout$headerHeight",
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
  showVerboseButton: boolean;
  showWatchButton: boolean;
  hideTestsAndSupressLogs: boolean;
}

const buttonsClassName = classNames(
  buttonClassName,
  roundedButtonClassName,
  css({ padding: "$space$1 $space$3" })
);

export const Header: React.FC<Props> = ({
  status,
  suiteOnly,
  setSuiteOnly,
  setVerbose,
  verbose,
  watchMode,
  setWatchMode,
  showSuitesOnly,
  showWatchButton,
  showVerboseButton,
  hideTestsAndSupressLogs,
}) => {
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
            type="button"
          >
            Suite only
          </button>
        )}
        {showVerboseButton && (
          <button
            className={buttonsClassName}
            data-active={verbose}
            disabled={status === "initialising" || hideTestsAndSupressLogs}
            onClick={setVerbose}
            type="button"
          >
            Verbose
          </button>
        )}
        {showWatchButton && (
          <button
            className={buttonsClassName}
            data-active={watchMode}
            disabled={status === "initialising"}
            onClick={setWatchMode}
            type="button"
          >
            Watch
          </button>
        )}
      </div>
    </div>
  );
};
