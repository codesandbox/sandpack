import * as React from "react";

import { ConsoleIcon } from "../..";
import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
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
}

export const Header: React.FC<Props> = ({
  status,
  suiteOnly,
  setSuiteOnly,
  setVerbose,
  verbose,
  watchMode,
  setWatchMode,
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
        <label className={classNames(buttonClassName)} htmlFor="verbose">
          <input
            checked={verbose}
            disabled={status === "initialising"}
            id="verbose"
            onChange={setVerbose}
            type="checkbox"
            value=""
          />
          Verbose
        </label>
        <label className={classNames(buttonClassName)} htmlFor="suiteOnly">
          <input
            checked={suiteOnly}
            disabled={status === "initialising"}
            id="suiteOnly"
            onChange={setSuiteOnly}
            type="checkbox"
            value=""
          />
          Suite only
        </label>
        <label className={classNames(buttonClassName)} htmlFor="watchMode">
          <input
            checked={watchMode}
            disabled={status === "initialising"}
            id="watchMode"
            onChange={setWatchMode}
            type="checkbox"
            value=""
          />
          Watch mode
        </label>
      </div>
    </div>
  );
};
