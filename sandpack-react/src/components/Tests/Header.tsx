import * as React from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

import { RunButton } from "./RunButton";
import type { Status } from "./SandpackTests";

const containerClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  padding: "$space$3 $space$2",
  fontFamily: "$font$mono",
  height: "$layout$headerHeight",
});

const buttonContainerClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "$space$2",
});

interface Props {
  runAllTests: () => void;
  runSpec: () => void;
  setVerbose: () => void;
  verbose: boolean;
  status: Status;
  isSpecOpen: boolean;
  watchMode: boolean;
  setWatchMode: () => void;
}

export const Header: React.FC<Props> = ({
  runAllTests,
  runSpec,
  status,
  setVerbose,
  verbose,
  watchMode,
  setWatchMode,
  isSpecOpen,
}) => {
  return (
    <div className={classNames(containerClassName)}>
      <div className={classNames(buttonContainerClassName)}>
        <RunButton disabled={status === "initialising"} onClick={runAllTests}>
          Run all
        </RunButton>
        {isSpecOpen && (
          <RunButton disabled={status === "initialising"} onClick={runSpec}>
            Run suite
          </RunButton>
        )}
      </div>

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
  );
};
