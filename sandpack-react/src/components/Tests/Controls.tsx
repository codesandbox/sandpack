import * as React from "react";

import { css } from "../../styles";
import { buttonClassName } from "../../styles/shared";
import { classNames } from "../../utils/classNames";

import { RunButton } from "./RunButton";

import type { Status } from "./";

const containerClassName = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid $colors$surface2",
  height: "40px",
  padding: "$space$4 $space$2",
  fontFamily: "$font$mono",
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
}

export const Controls: React.FC<Props> = ({
  runAllTests,
  runSpec,
  status,
  setVerbose,
  verbose,
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
    </div>
  );
};
